import { cn } from '@/lib/utils';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../components/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon, Sparkles, Loader2, ChevronLeft, ChevronRight, Plus, Utensils, Check } from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { dataService } from '../services/dataService';
import { generateWeeklyMealPlan } from '../services/geminiService';
import { Recipe, MealPlan } from '../types';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export const Planner = () => {
  const { user, profile } = useContext(AuthContext);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [plans, setPlans] = useState<MealPlan[]>([]);
  const [generating, setGenerating] = useState(false);
  const [activePlan, setActivePlan] = useState<MealPlan | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    const [r, p] = await Promise.all([
      dataService.getRecipes(user!.uid),
      dataService.getMealPlans(user!.uid)
    ]);
    setRecipes(r);
    setPlans(p);
    if (p.length > 0) setActivePlan(p[0]);
  };

  const handleGenerate = async () => {
    if (!profile) return;
    setGenerating(true);
    try {
      const startDate = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
      const planRes = await generateWeeklyMealPlan(profile, recipes, startDate);
      
      const newPlan: Omit<MealPlan, 'id'> = {
        ownerId: user!.uid,
        startDate,
        endDate: format(addDays(new Date(startDate), 6), 'yyyy-MM-dd'),
        days: planRes.days || []
      };
      
      const id = await dataService.addMealPlan(user!.uid, newPlan);
      await loadData();
      toast.success('AI Weekly Meal Plan Generated!');
    } catch (e) {
      toast.error('Failed to generate meal plan');
    } finally {
      setGenerating(false);
    }
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(selectedDate, { weekStartsOn: 1 }), i));

  const getMealsForDay = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    return activePlan?.days.find(d => d.date === formattedDate)?.meals || [];
  };

  return (
    <div className="p-6 pb-24 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-black tracking-tight text-primary">Meal Planner</h1>
          <p className="text-sm text-muted-foreground italic">Balance your week with AI assistance</p>
        </div>
        <Button
          data-testid="planner-generate"
          onClick={handleGenerate} 
          disabled={generating}
          className="rounded-2xl bg-primary hover:bg-primary/90 border-none shadow-sm h-12 px-6"
        >
          {generating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
          Auto-Generate
        </Button>
      </div>

      <div className="flex items-center justify-between bg-card rounded-[1.5rem] p-4 shadow-sm border border-border/50">
        <Button variant="ghost" size="icon" onClick={() => setSelectedDate(addDays(selectedDate, -7))}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-primary" />
          <span className="font-bold">Week of {format(startOfWeek(selectedDate, { weekStartsOn: 1 }), 'MMM d, yyyy')}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setSelectedDate(addDays(selectedDate, 7))}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid gap-4">
        {weekDays.map((day, i) => {
          const meals = getMealsForDay(day);
          const isToday = isSameDay(day, new Date());
          
          return (
            <Card key={i} className={cn(
              "rounded-[1.5rem] border border-border/50 shadow-sm overflow-hidden bg-card",
              isToday ? "ring-2 ring-primary/30 scale-[1.01]" : "opacity-90"
            )}>
              <div className={cn(
                "px-6 py-4 flex items-center justify-between",
                isToday ? "bg-muted/60" : "bg-card"
              )}>
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold",
                    isToday ? "bg-primary text-primary-foreground" : "bg-muted text-primary"
                  )}>
                    {format(day, 'd')}
                  </div>
                  <div>
                    <p className="font-bold text-lg">{format(day, 'EEEE')}</p>
                    {isToday && <p className="font-label text-[10px] uppercase font-semibold text-primary tracking-widest">TODAY</p>}
                  </div>
                </div>
                <Button size="icon" variant="ghost" className="rounded-xl hover:bg-muted">
                  <Plus className="h-5 w-5 text-muted-foreground" />
                </Button>
              </div>
              <CardContent className="p-0 bg-card">
                <div className="divide-y divide-border/60">
                  {['breakfast', 'lunch', 'dinner'].map((mealType) => {
                    const meal = meals.find(m => m.type === mealType);
                    return (
                      <div key={mealType} className="px-6 py-4 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="w-4 h-4 rounded-full border-2 border-border flex-shrink-0" />
                          <div>
                            <p className="font-label text-[10px] uppercase font-semibold text-muted-foreground tracking-[0.22em]">{mealType}</p>
                            <p className={cn(
                              "font-medium",
                              meal ? "text-primary" : "text-muted-foreground/50 italic"
                            )}>
                              {meal ? meal.recipeTitle : 'Tap to select meal'}
                            </p>
                          </div>
                        </div>
                        {meal && (
                          <Badge variant="secondary" className="bg-muted border-none group-hover:bg-muted/80 cursor-pointer text-primary">
                            View 
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// End of Planner

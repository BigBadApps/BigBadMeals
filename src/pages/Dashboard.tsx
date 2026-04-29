import { cn } from '@/lib/utils';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../components/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChefHat, Calendar, TrendingUp, DollarSign, ArrowRight, Star, Clock, AlertCircle, Plus } from 'lucide-react';
import { dataService } from '../services/dataService';
import { Recipe, MealPlan } from '../types';
import { format, isToday } from 'date-fns';
import { Tab } from '../components/Navigation';

type DashboardProps = {
  navigate: (tab: Tab) => void;
};

export const Dashboard = ({ navigate }: DashboardProps) => {
  const { user, profile } = useContext(AuthContext);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [activePlan, setActivePlan] = useState<MealPlan | null>(null);

  useEffect(() => {
    if (user) {
      dataService.getRecipes(user.uid).then(setRecipes);
      dataService.getMealPlans(user.uid).then(plans => {
        if (plans.length > 0) setActivePlan(plans[0]);
      });
    }
  }, [user]);

  const todaysMeals = activePlan?.days.find(d => d.date === format(new Date(), 'yyyy-MM-dd'))?.meals || [];
  const nextMeal = todaysMeals[0]; // Simplistic logic for "Next"

  const openAddRecipe = () => {
    sessionStorage.setItem('bb:recipes:openAdd', '1');
    navigate('recipes');
  };

  const openRecipe = (recipeId: string | undefined) => {
    if (!recipeId) {
      navigate('recipes');
      return;
    }
    sessionStorage.setItem('bb:recipes:openRecipeId', recipeId);
    navigate('recipes');
  };

  const handleLetsCook = () => {
    if (nextMeal?.recipeId) {
      openRecipe(nextMeal.recipeId);
      return;
    }
    if (recipes.length > 0) {
      openRecipe(recipes[0]?.id);
      return;
    }
    openAddRecipe();
  };

  return (
    <div className="p-6 pb-24 space-y-8 max-w-4xl mx-auto">
      {/* Greeting */}
      <div>
        <h1 className="text-4xl font-bold font-serif text-[#451a03]">Welcome, {profile?.displayName?.split(' ')[0]}</h1>
        <p className="text-lg text-[#92400e]/60 font-medium">Ready for a smart kitchen today?</p>
      </div>

      {/* Main Action Card: Current Meal */}
      <Card className="rounded-[2.5rem] border-none bg-gradient-to-br from-[#d97706] to-[#b45309] text-white shadow-2xl shadow-amber-900/20 overflow-hidden">
        <CardContent className="p-8 relative">
          <Utensils className="absolute -right-8 -top-8 h-48 w-48 opacity-10 rotate-12" />
          <div className="space-y-1 mb-8">
            <span className="text-xs uppercase tracking-widest font-black text-amber-200 bg-black/10 px-3 py-1 rounded-full">Next Serving</span>
            <h2 className="text-4xl font-bold font-serif">{nextMeal?.recipeTitle || 'No meal scheduled'}</h2>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex flex-col">
               <span className="text-[10px] uppercase font-bold text-amber-200">Prepare</span>
               <span className="text-xl font-bold">~35 min</span>
             </div>
             <div className="flex flex-col">
               <span className="text-[10px] uppercase font-bold text-amber-200">Difficulty</span>
               <span className="text-xl font-bold">Easy</span>
             </div>
             <Button
               className="ml-auto rounded-2xl bg-white text-[#d97706] hover:bg-amber-50 h-12 px-6 font-bold shadow-lg"
               onClick={handleLetsCook}
               data-testid="dashboard-lets-cook"
             >
               Let's Cook <ArrowRight className="ml-2 h-4 w-4" />
             </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={ChefHat} label="Recipes" value={recipes.length.toString()} trend="+2 this week" color="bg-orange-50 text-orange-600" />
        <StatCard icon={Star} label="Favorites" value={recipes.filter(r => r.isFavorite).length.toString()} color="bg-amber-50 text-amber-600" />
        <StatCard icon={DollarSign} label="Weekly Budget" value="$140" trend="On Track" color="bg-green-50 text-green-600" />
        <StatCard icon={TrendingUp} label="Nutrition" value="B+" trend="Improving" color="bg-blue-50 text-blue-600" />
      </div>

      {/* Today's Schedule (Bento Style) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-bold font-serif flex items-center gap-2">
            <Calendar className="h-6 w-6 text-[#d97706]" /> Today's Schedule
          </h2>
          <Button
            variant="ghost"
            className="text-[#d97706] font-bold"
            onClick={() => navigate('planner')}
            data-testid="dashboard-view-week"
          >
            View Week
          </Button>
        </div>
        
        <div className="grid gap-4">
          {['Breakfast', 'Lunch', 'Dinner'].map((type) => {
             const meal = todaysMeals.find(m => m.type.toLowerCase() === type.toLowerCase());
             return (
               <div key={type} className="flex items-center gap-6 p-6 bg-white rounded-[2rem] shadow-xl shadow-amber-900/5 hover:bg-amber-50/30 transition-colors group">
                 <div className="w-16 h-16 rounded-3xl bg-amber-50 flex items-center justify-center font-black text-amber-200 text-2xl">
                    {type[0]}
                 </div>
                 <div className="flex-1">
                   <p className="text-[10px] uppercase tracking-widest font-black text-amber-500/50">{type}</p>
                   <p className={cn("text-xl font-bold", !meal && "text-[#92400e]/20 italic")}>
                     {meal?.recipeTitle || `No ${type} planned`}
                   </p>
                 </div>
                 {meal ? (
                   <button
                     type="button"
                     className="flex items-center gap-2 text-amber-600 font-bold bg-amber-100/50 px-4 py-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                     onClick={() => openRecipe(meal.recipeId)}
                   >
                      Start <ChefHat className="h-4 w-4" />
                   </button>
                 ) : (
                   <button
                     type="button"
                     className="p-1"
                     onClick={() => navigate('planner')}
                     aria-label={`Add ${type} meal`}
                   >
                     <Plus className="h-6 w-6 text-amber-200 group-hover:text-amber-500" />
                   </button>
                 )}
               </div>
             );
          })}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, trend, color }: any) => (
  <Card className="rounded-[2rem] border-none shadow-xl shadow-amber-900/5 bg-white p-6">
    <div className="flex items-center gap-4 mb-4">
      <div className={cn("p-3 rounded-2xl", color)}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-[10px] uppercase font-black text-amber-900/30 tracking-widest">{label}</p>
        <p className="text-2xl font-bold text-[#451a03]">{value}</p>
      </div>
    </div>
    {trend && <p className="text-xs font-bold text-green-600/80 bg-green-50/50 px-3 py-1 rounded-full w-fit">{trend}</p>}
  </Card>
);

function Utensils(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 2 7 7" />
      <path d="m3 12 7-7" />
      <path d="m11 20 2-2" />
      <path d="m15 16 2-2" />
      <path d="m19 12 2-2" />
      <path d="M20 21v-2a4 4 0 0 0-4-4h-2a4 4 0 0 0-4 4v2" />
    </svg>
  );
}

// End of Dashboard

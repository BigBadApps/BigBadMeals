import React, { useContext, useState } from 'react';
import { AuthContext } from '../components/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Users, Plus, X, Heart, ShieldAlert, LogOut, Save, Activity, CheckCircle2, XCircle } from 'lucide-react';
import { dataService } from '../services/dataService';
import { toast } from 'sonner';
import { testAiIntegration } from '../lib/aiTest';
import { testConnection } from '../lib/firebaseTest';

export const Profile = () => {
  const { profile, logout, refreshProfile } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState<{ai?: any, firebase?: any, error?: string} | null>(null);

  if (!profile) return null;

  const runDiagnostics = async () => {
    setTesting(true);
    setTestResults(null);
    try {
      const ai = await testAiIntegration();
      const firebase = await testConnection();
      setTestResults({ ai, firebase });
      if (ai.success) {
        toast.success('AI Integration Verified!');
      } else {
        toast.error('AI Integration Failed');
      }
    } catch (e) {
      setTestResults({ error: 'Diagnostics failed to run' });
      toast.error('Diagnostics failed');
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async () => {
    if (!formData) return;
    try {
      await dataService.saveUserProfile(formData);
      await refreshProfile();
      setEditing(false);
      toast.success('Preferences updated!');
    } catch (e) {
      toast.error('Failed to save profile');
    }
  };

  const addFamilyMember = () => {
    if (!formData) return;
    setFormData({
      ...formData,
      familyMembers: [...formData.familyMembers, { name: '', role: '', preferences: [], allergies: [] }]
    });
  };

  const removeFamilyMember = (index: number) => {
    if (!formData) return;
    const newMembers = [...formData.familyMembers];
    newMembers.splice(index, 1);
    setFormData({ ...formData, familyMembers: newMembers });
  };

  const updateFamilyMember = (index: number, field: string, value: any) => {
    if (!formData) return;
    const newMembers = [...formData.familyMembers];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setFormData({ ...formData, familyMembers: newMembers });
  };

  return (
    <div className="p-6 pb-12 space-y-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#451a03]">Family Kitchen</h1>
          <p className="text-[#92400e]/60 italic">Personalize your household experience</p>
        </div>
        <Button variant="outline" size="sm" onClick={logout} className="rounded-xl border-amber-200">
          <LogOut className="h-4 w-4 mr-2" /> Sign Out
        </Button>
      </div>

      <Card className="rounded-[2rem] border-none shadow-xl shadow-amber-900/5 bg-white overflow-hidden">
        <CardHeader className="bg-amber-50/50 pb-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-[#d97706]" /> User Profile
              </CardTitle>
              <CardDescription>{profile.email}</CardDescription>
            </div>
            {!editing ? (
              <Button onClick={() => setEditing(true)} variant="secondary" className="rounded-xl bg-white shadow-sm border border-amber-100">Edit</Button>
            ) : (
              <Button onClick={handleSave} className="rounded-xl bg-[#d97706] hover:bg-[#b45309]">
                <Save className="h-4 w-4 mr-2" /> Save
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Diaries & Restrictions</Label>
              <Input 
                disabled={!editing}
                placeholder="e.g. Vegan, Keto, Nut-free" 
                value={formData?.globalPreferences.dietaryRestrictions.join(', ')}
                onChange={(e) => setFormData({...formData!, globalPreferences: {...formData!.globalPreferences, dietaryRestrictions: e.target.value.split(',').map(s => s.trim())}})}
                className="rounded-xl border-amber-100 focus-visible:ring-[#d97706]"
              />
            </div>
            <div className="space-y-2">
              <Label>Favorite Cuisines</Label>
              <Input 
                disabled={!editing}
                placeholder="e.g. Italian, Mexican, Thai" 
                value={formData?.globalPreferences.cuisines.join(', ')}
                onChange={(e) => setFormData({...formData!, globalPreferences: {...formData!.globalPreferences, cuisines: e.target.value.split(',').map(s => s.trim())}})}
                className="rounded-xl border-amber-100 focus-visible:ring-[#d97706]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users className="h-5 w-5 text-[#d97706]" /> Family Members
          </h2>
          {editing && (
            <Button size="sm" variant="ghost" onClick={addFamilyMember} className="text-[#d97706] hover:text-[#b45309] hover:bg-amber-50">
              <Plus className="h-4 w-4 mr-1" /> Add Member
            </Button>
          )}
        </div>

        <div className="grid gap-4">
          {(editing ? formData?.familyMembers : profile.familyMembers).map((member, i) => (
            <Card key={i} className="rounded-3xl border border-amber-50 bg-white/50 backdrop-blur-sm group">
              <CardContent className="p-5 relative">
                {editing && (
                  <button 
                    onClick={() => removeFamilyMember(i)}
                    className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md border border-amber-100 text-red-500 hover:scale-110 transition-transform"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase tracking-widest text-[#92400e]/50 font-bold">Name</Label>
                    <Input 
                      disabled={!editing}
                      value={member.name}
                      onChange={(e) => updateFamilyMember(i, 'name', e.target.value)}
                      className="border-none bg-transparent p-0 h-auto focus-visible:ring-0 text-lg font-bold"
                      placeholder="Name"
                    />
                  </div>
                  <div className="space-y-1 text-right">
                    <Label className="text-[10px] uppercase tracking-widest text-[#92400e]/50 font-bold">Role</Label>
                    <Input 
                      disabled={!editing}
                      value={member.role}
                      onChange={(e) => updateFamilyMember(i, 'role', e.target.value)}
                      className="border-none bg-transparent p-0 h-auto focus-visible:ring-0 text-right italic"
                      placeholder="Role (e.g. Spouse)"
                    />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-amber-50/50 grid grid-cols-2 gap-4">
                  <div>
                    <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#92400e]/50 font-bold mb-2">
                       <Heart className="h-3 w-3 fill-pink-500/10 text-pink-500" /> Prefers
                    </span>
                    <Input 
                      disabled={!editing}
                      value={member.preferences.join(', ')}
                      onChange={(e) => updateFamilyMember(i, 'preferences', e.target.value.split(',').map(s => s.trim()))}
                      className="text-xs border-none bg-amber-50/50 rounded-xl px-3"
                      placeholder="e.g. Pasta, Fruit"
                    />
                  </div>
                  <div>
                    <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#92400e]/50 font-bold mb-2">
                       <ShieldAlert className="h-3 w-3 text-amber-600" /> Allergies
                    </span>
                    <Input 
                      disabled={!editing}
                      value={member.allergies.join(', ')}
                      onChange={(e) => updateFamilyMember(i, 'allergies', e.target.value.split(',').map(s => s.trim()))}
                      className="text-xs border-none bg-red-50/50 rounded-xl px-3"
                      placeholder="e.g. Shellfish"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {(!editing ? profile.familyMembers : formData?.familyMembers).length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-amber-100 rounded-[2rem] text-[#92400e]/40 italic">
              No family members added yet. Add them to personalize plans!
            </div>
          )}
        </div>
      </div>

      <Card className="rounded-[2rem] border border-amber-100 bg-amber-50/20">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Activity className="h-5 w-5 text-amber-600" /> System Diagnostics
          </CardTitle>
          <CardDescription>Verify AI and Database connectivity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={runDiagnostics} 
              disabled={testing}
              className="rounded-xl"
            >
              {testing ? 'Running Tests...' : 'Run System Check'}
            </Button>
          </div>
          
          {testResults && (
            <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-amber-100">
                    <span className="font-medium">Gemini AI Service</span>
                    {testResults.ai?.success ? (
                        <span className="flex items-center text-green-600 text-sm font-bold gap-1">
                            <CheckCircle2 className="h-4 w-4" /> Operational
                        </span>
                    ) : (
                        <span className="flex items-center text-red-600 text-sm font-bold gap-1">
                            <XCircle className="h-4 w-4" /> Error: {testResults.ai?.error || 'Unknown'}
                        </span>
                    )}
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-amber-100">
                    <span className="font-medium">Firebase Firestore</span>
                    {testResults.firebase?.success ? (
                        <span className="flex items-center text-green-600 text-sm font-bold gap-1">
                            <CheckCircle2 className="h-4 w-4" /> Operational
                        </span>
                    ) : (
                        <span className="flex items-center text-red-600 text-sm font-bold gap-1">
                            <XCircle className="h-4 w-4" /> {testResults.firebase?.error || 'Failed'}
                        </span>
                    )}
                </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

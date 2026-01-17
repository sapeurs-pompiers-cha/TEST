import { useAgents } from "../hooks/use-agents";
import { Users, Calendar as CalendarIcon, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";


export default function Dashboard() {
  const { data: agents, isLoading: agentsLoading } = useAgents();

  if (agentsLoading) {
    return <div className="flex items-center justify-center h-full"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>;
  }

  const activeAgents = agents?.length || 0;

  // Logic for next maneuver date: first Sunday of next month
  const getFirstSundayNextMonth = () => {
    const now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1; // Start with next month

    if (month > 11) {
      month = 0;
      year++;
    }

    const firstDay = new Date(year, month, 1);
    const dayOfWeek = firstDay.getDay(); // 0 is Sunday
    const diff = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;

    const firstSunday = new Date(year, month, 1 + diff);
    return firstSunday;
  };

  const nextManeuverDate = getFirstSundayNextMonth();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Tableau de bord</h1>
        <p className="text-muted-foreground mt-2">Vue d'ensemble de l'activité de la caserne.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Statistics Column */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Active Agents Stat */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-bold font-display text-foreground">{activeAgents}</h3>
              <p className="text-sm font-medium text-muted-foreground">Agents Actifs</p>
            </div>
          </motion.div>

          {/* Next Maneuver Date */}
          <Card className="rounded-2xl border-border shadow-sm overflow-hidden bg-white dark:bg-slate-900">
            <CardHeader className="pb-4 bg-orange-50/50 dark:bg-orange-950/20 border-b border-orange-100 dark:border-orange-900/30">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-primary">
                <CalendarIcon className="w-5 h-5" />
                Prochaine Manœuvre
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8 pb-8 text-center">
              <div className="space-y-2">
                <p className="text-4xl font-black text-foreground tracking-tight">
                  {nextManeuverDate.getDate()}
                </p>
                <p className="text-xl font-bold text-primary capitalize">
                  {nextManeuverDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </p>
                <div className="inline-flex items-center px-3 py-1 mt-4 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 text-xs font-bold uppercase tracking-wider">
                  Premier Dimanche
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

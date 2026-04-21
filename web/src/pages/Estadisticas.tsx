import { useEffect, useState } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    LineChart, Line
} from 'recharts';
import { Activity, Trophy, Gamepad2, Calendar} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { getUserDetailedStats } from '../features/account/services/account.service';
import IconSpinner from '../shared/layout/Spinner';


export default function Estadisticas() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const loadStats = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const data = await getUserDetailedStats(user.id);
                setStats(data);
            }
            setLoading(false);
        };
        loadStats();
    }, []);

    if (loading) return <IconSpinner />;

    if (!stats || stats.totalMatches === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <Gamepad2 size={64} className="mx-auto text-slate-700 mb-4" />
                <h1 className="text-2xl font-bold text-white">Aún no hay estadísticas</h1>
                <p className="text-slate-400 mt-2">Juega unas cuantas partidas para empezar a ver tus gráficas.</p>
                <Link to="/juegos" className="inline-block mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors">
                    Ir a jugar
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 pb-20">
            <div className="container mx-auto px-4 py-8">
                
                {/* Cabecera */}
                <div className="flex items-center gap-4 mb-8">

                    <div>
                        <h1 className="text-3xl font-bold text-white">Panel de Estadísticas</h1>
                        <p className="text-slate-400">Análisis detallado de tu rendimiento en los juegos</p>
                    </div>
                </div>

                {/* Tarjetas de Resumen Rápido */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                                <Activity size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 uppercase font-semibold">Partidas Totales</p>
                                <p className="text-3xl font-bold text-white">{stats.totalMatches}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
                                <Trophy size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 uppercase font-semibold">Puntuación Máxima</p>
                                <p className="text-3xl font-bold text-white">{stats.highestScore.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                                <Gamepad2 size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 uppercase font-semibold">Juego Favorito</p>
                                <p className="text-xl font-bold text-white truncate">{stats.favoriteGame}</p>
                                <p className="text-xs text-slate-500">{stats.favoriteGamePlays} partidas jugadas</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Gráfico de Barras: Popularidad */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Activity size={18} className="text-indigo-400" />
                            Veces Jugadas por Juego
                        </h3>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                        itemStyle={{ color: '#818cf8' }}
                                    />
                                    <Bar dataKey="plays" fill="#6366f1" radius={[4, 4, 0, 0]} name="Partidas" maxBarSize={60} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Gráfico de Líneas: Evolución de Puntos */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Calendar size={18} className="text-emerald-400" />
                            Historial de Puntuaciones
                        </h3>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={stats.historyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="score" 
                                        stroke="#10b981" 
                                        strokeWidth={3} 
                                        dot={{ r: 4, fill: '#10b981' }} 
                                        activeDot={{ r: 6 }}
                                        name="Puntos"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>

                {/* Tabla Detallada Final */}
                <div className="mt-10 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-slate-800">
                        <h3 className="text-lg font-bold text-white">Desglose por Juego</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-800/50 text-slate-400 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Juego</th>
                                    <th className="px-6 py-4 font-semibold text-center">Partidas</th>
                                    <th className="px-6 py-4 font-semibold text-right">Mejor Puntuación</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {stats.chartData.map((game: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-white/5 transition-colors text-slate-300">
                                        <td className="px-6 py-4 font-medium text-white">{game.name}</td>
                                        <td className="px-6 py-4 text-center">{game.plays}</td>
                                        <td className="px-6 py-4 text-right font-mono text-indigo-400">
                                            {game.highScore.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
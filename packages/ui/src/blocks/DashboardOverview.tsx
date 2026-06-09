import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/Card';
import { StatCard } from '../components/StatCard';
import { Container } from '../components/Container';
import { Button } from '../components/Button';
import { Users, DollarSign, Activity, ShoppingBag, ArrowUpRight } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

export interface ChartDataPoint {
  name: string;
  visitors: number;
  revenue: number;
}

export interface RecentTransaction {
  id: string;
  user: string;
  email: string;
  amount: string;
  status: 'Completed' | 'Pending' | 'Failed';
  date: string;
}

export interface DashboardOverviewProps {
  stats?: {
    revenue: string | number;
    revenueChange: number;
    users: string | number;
    usersChange: number;
    conversion: string | number;
    conversionChange: number;
    orders: string | number;
    ordersChange: number;
  };
  chartData?: ChartDataPoint[];
  transactions?: RecentTransaction[];
}

const defaultChartData: ChartDataPoint[] = [
  { name: 'Jan', visitors: 2400, revenue: 1400 },
  { name: 'Feb', visitors: 1398, revenue: 2210 },
  { name: 'Mar', visitors: 9800, revenue: 2290 },
  { name: 'Apr', visitors: 3908, revenue: 2000 },
  { name: 'May', visitors: 4800, revenue: 2181 },
  { name: 'Jun', visitors: 3800, revenue: 2500 },
  { name: 'Jul', visitors: 4300, revenue: 2100 },
];

const defaultTransactions: RecentTransaction[] = [
  { id: '1', user: 'Olivia Martin', email: 'olivia.martin@email.com', amount: '+$1,999.00', status: 'Completed', date: 'Just now' },
  { id: '2', user: 'Jackson Lee', email: 'jackson.lee@email.com', amount: '+$39.00', status: 'Completed', date: '5 mins ago' },
  { id: '3', user: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', amount: '+$299.00', status: 'Pending', date: '1 hour ago' },
  { id: '4', user: 'William Kim', email: 'will@email.com', amount: '-$15.00', status: 'Failed', date: 'Yesterday' },
  { id: '5', user: 'Sofia Davis', email: 'sofia.davis@email.com', amount: '+$350.00', status: 'Completed', date: '2 days ago' },
];

export function DashboardOverview({
  stats = {
    revenue: '$45,231.89',
    revenueChange: 20.1,
    users: '+2,350',
    usersChange: 180.1,
    conversion: '+12.2%',
    conversionChange: 19.2,
    orders: '+12,234',
    ordersChange: -1.2,
  },
  chartData = defaultChartData,
  transactions = defaultTransactions,
}: DashboardOverviewProps) {
  return (
    <section className="py-10 bg-background/50">
      <Container className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Real-time analytics and system state metrics.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <h3 className="sr-only">Key metrics</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value={stats.revenue}
            change={stats.revenueChange}
            timeframe="from last month"
            icon={<DollarSign className="h-4 w-4" />}
          />
          <StatCard
            title="Active Users"
            value={stats.users}
            change={stats.usersChange}
            timeframe="from last month"
            icon={<Users className="h-4 w-4" />}
          />
          <StatCard
            title="Conversion Rate"
            value={stats.conversion}
            change={stats.conversionChange}
            timeframe="from last month"
            icon={<Activity className="h-4 w-4" />}
          />
          <StatCard
            title="Sales Volume"
            value={stats.orders}
            change={stats.ordersChange}
            timeframe="from last month"
            icon={<ShoppingBag className="h-4 w-4" />}
          />
        </div>

        {/* Graphs and Lists */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-7">
          {/* Main Area Graph */}
          <Card className="lg:col-span-4 border border-border bg-card">
            <CardHeader>
              <CardTitle>Analytics Overview</CardTitle>
              <CardDescription>
                Track visitor count and monthly revenue streams dynamically.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] pl-2 pr-4 pb-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary, #2563eb)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--primary, #2563eb)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border, #e2e8f0)" />
                  <XAxis dataKey="name" fontSize={11} stroke="#94a3b8" />
                  <YAxis fontSize={11} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card, #ffffff)',
                      borderColor: 'var(--border, #e2e8f0)',
                      color: 'var(--foreground, #0f172a)',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--primary, #2563eb)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Operations */}
          <Card className="lg:col-span-3 border border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>You made 265 sales this month.</CardDescription>
              </div>
              <Button size="icon" variant="ghost" aria-label="View all sales" className="h-8 w-8">
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-6">
                {transactions.map((t) => (
                  <div key={t.id} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center font-bold text-xs uppercase text-secondary-foreground shrink-0">
                        {t.user.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{t.user}</p>
                        <p className="text-xs text-muted-foreground truncate">{t.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">{t.amount}</p>
                      <span className="text-[10px] text-muted-foreground">{t.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
}

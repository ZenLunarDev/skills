export interface DashboardMetric {
  id: string;
  title: string;
  value: number;
  previousValue: number;
  unit: string;
  icon: React.ReactNode;
  format?: 'number' | 'currency' | 'percentage';
}

export interface DashboardProps {
  userId: string;
  dateRange: {
    start: Date;
    end: Date;
  };
}

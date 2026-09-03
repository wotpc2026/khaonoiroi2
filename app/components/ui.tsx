import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { AlertTriangle, Inbox } from 'lucide-react';

export function Button({ className = '', children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`button-primary min-h-11 ${className}`} {...props}>{children}</button>;
}

export function Card({ className = '', children }: { className?: string; children: ReactNode }) {
  return <section className={`panel ${className}`}>{children}</section>;
}

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info' }) {
  return <span className={`status-badge status-${tone}`}>{children}</span>;
}

export function PageHeader({ eyebrow = 'KHAONOI ROI2 63', title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <header className="page-header"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{description && <p className="page-description">{description}</p>}</div>{action}</header>;
}

export function StatCard({ label, value, detail }: { label: string; value: ReactNode; detail: string }) {
  return <Card className="stat-card reveal-card"><p className="text-sm text-muted">{label}</p><strong>{value}</strong><span>{detail}</span></Card>;
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="empty-state"><Inbox size={28} /><strong>{title}</strong><p>{description}</p></div>;
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return <div className="empty-state error-state"><AlertTriangle size={28} /><strong>เกิดข้อผิดพลาด</strong><p>ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง</p>{onRetry && <button className="button-secondary" onClick={onRetry}>ลองใหม่</button>}</div>;
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />;
}

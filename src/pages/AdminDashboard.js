import { useEffect, useMemo, useState } from 'react';
import { collectionGroup, getDocs, doc, getDoc } from 'firebase/firestore';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext'; // expects: const { user } = useAuth()
import { buildAnalytics, ordersToCsv, money, orderTotal, toDate } from '../utils/analytics';

const ACCENT = '#0f766e';
const ACCENT_SOFT = '#99d5cf';

const RANGES = [
  { label: '7 days', days: 7 },
  { label: '30 days', days: 30 },
  { label: '90 days', days: 90 },
  { label: 'All time', days: null },
];

const css = `
.ad { max-width: 1100px; margin: 0 auto; padding: 24px 16px 48px; }
.ad-head { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.ad-head h1 { margin: 0; font-size: 1.6rem; }
.ad-tools { display: flex; flex-wrap: wrap; gap: 8px; }
.ad-btn { border: 1px solid #cfd6dd; background: #fff; color: #1f2933; padding: 7px 12px; border-radius: 6px; cursor: pointer; font-size: 0.9rem; }
.ad-btn:hover { border-color: ${ACCENT}; }
.ad-btn:focus-visible { outline: 2px solid ${ACCENT}; outline-offset: 2px; }
.ad-btn.on { background: ${ACCENT}; border-color: ${ACCENT}; color: #fff; }
.ad-kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin-bottom: 20px; }
.ad-kpi { background: #fff; border: 1px solid #e3e8ed; border-radius: 8px; padding: 14px 16px; }
.ad-kpi span { display: block; font-size: 0.85rem; color: #52606d; }
.ad-kpi strong { display: block; font-size: 1.45rem; margin-top: 4px; color: #1f2933; }
.ad-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px; margin-bottom: 16px; }
.ad-card { background: #fff; border: 1px solid #e3e8ed; border-radius: 8px; padding: 16px; min-width: 0; }
.ad-card.wide { grid-column: 1 / -1; }
.ad-card h2 { margin: 0 0 12px; font-size: 1.05rem; color: #1f2933; }
.ad-empty { color: #52606d; padding: 24px 0; text-align: center; }
.ad-scroll { overflow-x: auto; }
.ad-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; color: #1f2933; }
.ad-table th, .ad-table td { text-align: left; padding: 8px 10px; border-bottom: 1px solid #e3e8ed; white-space: nowrap; }
.ad-table td.r, .ad-table th.r { text-align: right; }
.ad-msg { max-width: 520px; margin: 80px auto; text-align: center; padding: 0 16px; }
`;

export default function AdminDashboard() {
  const { user } = useAuth();
  const [access, setAccess] = useState('checking'); // checking | denied | ok
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(30);

  // An admin is a user who has a document at admins/{uid}
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    getDoc(doc(db, 'admins', user.uid))
      .then((snap) => !cancelled && setAccess(snap.exists() ? 'ok' : 'denied'))
      .catch(() => !cancelled && setAccess('denied'));
    return () => {
      cancelled = true;
    };
  }, [user]);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      // Reads the "orders" collection under every user
      const snap = await getDocs(collectionGroup(db, 'orders'));
      setOrders(
        snap.docs.map((d) => ({
          id: d.id,
          userId: d.ref.parent.parent ? d.ref.parent.parent.id : '',
          ...d.data(),
        }))
      );
    } catch (e) {
      setError('Could not load orders. Check your Firestore rules for admin access.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (access === 'ok') load();
  }, [access]);

  const data = useMemo(() => buildAnalytics(orders, days), [orders, days]);

  const downloadCsv = () => {
    const blob = new Blob([ordersToCsv(orders)], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shopease-orders.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (access === 'checking') return <div className="ad-msg">Checking access…</div>;
  if (access === 'denied')
    return (
      <div className="ad-msg">
        <h1>Admins only</h1>
        <p>Your account does not have access to the dashboard.</p>
      </div>
    );

  const { kpis, daily, topProducts, byCategory, byStatus, recent } = data;
  const hasOrders = kpis.orders > 0;

  return (
    <div className="ad">
      <style>{css}</style>

      <div className="ad-head">
        <h1>Sales dashboard</h1>
        <div className="ad-tools">
          {RANGES.map((r) => (
            <button
              key={r.label}
              className={`ad-btn ${days === r.days ? 'on' : ''}`}
              onClick={() => setDays(r.days)}
            >
              {r.label}
            </button>
          ))}
          <button className="ad-btn" onClick={load} disabled={loading}>
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
          <button className="ad-btn" onClick={downloadCsv} disabled={!orders.length}>
            Download CSV
          </button>
        </div>
      </div>

      {error && <p role="alert">{error}</p>}

      <div className="ad-kpis">
        <div className="ad-kpi"><span>Revenue</span><strong>{money(kpis.revenue)}</strong></div>
        <div className="ad-kpi"><span>Orders</span><strong>{kpis.orders}</strong></div>
        <div className="ad-kpi"><span>Average order value</span><strong>{money(kpis.avgOrderValue)}</strong></div>
        <div className="ad-kpi"><span>Customers</span><strong>{kpis.customers}</strong></div>
        <div className="ad-kpi"><span>Repeat customers</span><strong>{kpis.repeatRate.toFixed(0)}%</strong></div>
        <div className="ad-kpi"><span>Cancelled orders</span><strong>{kpis.cancelled}</strong></div>
      </div>

      {!hasOrders && !loading ? (
        <div className="ad-card ad-empty">
          No orders in this period. Place a test order or choose a longer range.
        </div>
      ) : (
        <>
          <div className="ad-card wide" style={{ marginBottom: 16 }}>
            <h2>Revenue per day</h2>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={daily} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid stroke="#e3e8ed" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} minTickGap={24} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => '$' + v} width={56} />
                <Tooltip formatter={(v, n) => (n === 'revenue' ? money(v) : v)} />
                <Area type="monotone" dataKey="revenue" stroke={ACCENT} fill={ACCENT_SOFT} fillOpacity={0.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="ad-grid">
            <div className="ad-card">
              <h2>Top products by units sold</h2>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={topProducts} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <CartesianGrid stroke="#e3e8ed" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="units" fill={ACCENT} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="ad-card">
              <h2>Revenue by category</h2>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={byCategory} margin={{ left: 0, right: 8 }}>
                  <CartesianGrid stroke="#e3e8ed" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => '$' + v} width={56} />
                  <Tooltip formatter={(v) => money(v)} />
                  <Bar dataKey="revenue" fill={ACCENT} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="ad-card">
              <h2>Orders by status</h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={byStatus} margin={{ left: 0, right: 8 }}>
                  <CartesianGrid stroke="#e3e8ed" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} width={32} />
                  <Tooltip />
                  <Bar dataKey="count" fill={ACCENT} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="ad-card">
              <h2>Recent orders</h2>
              <div className="ad-scroll">
                <table className="ad-table">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th className="r">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((o) => (
                      <tr key={o.userId + o.id}>
                        <td>{o.id.slice(0, 8)}</td>
                        <td>{toDate(o.createdAt)?.toLocaleDateString()}</td>
                        <td>{o.status || 'Confirmed'}</td>
                        <td className="r">{money(orderTotal(o))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

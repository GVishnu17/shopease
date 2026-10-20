// Turns raw order documents into the numbers the admin dashboard shows.
// Orders are read as saved by ShopEase checkout:
// { id, userId, items: [{ id, name, price, quantity }], subtotal, shipping, tax, discount, total, status, createdAt }

import productData from '../data/products.json';

// Items in saved orders have no category, so look it up from the product list
const productList = Array.isArray(productData) ? productData : productData.products || [];
const categoryById = {};
productList.forEach((p) => {
  categoryById[p.id] = p.category;
});

const num = (v) => Number(v) || 0;

export const money = (n) =>
  '$' + num(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// createdAt can be a Firestore Timestamp, an ISO string or a number
export function toDate(v) {
  if (!v) return null;
  if (typeof v.toDate === 'function') return v.toDate();
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

// Totals are saved directly on the order (or inside a "totals" group)
export function orderTotal(o) {
  const t = o.totals || o;
  if (t.total != null) return num(t.total);
  return num(t.subtotal) + num(t.shipping) + num(t.tax) - num(t.discount);
}

const itemQty = (i) => num(i.qty ?? i.quantity ?? 1) || 1;
const itemName = (i) => i.name || i.title || `Product ${i.id}`;
const itemPrice = (i) => num(i.price);

// Local date as YYYY-MM-DD, so days line up with the admin's own calendar
const dayKey = (d) => d.toLocaleDateString('en-CA');

const isCancelled = (o) => String(o.status || '').toLowerCase() === 'cancelled';
const orderRevenue = (o) => Math.max(0, orderTotal(o) - num(o.refundAmount));

export function buildAnalytics(orders, days) {
  const now = new Date();
  const start = days ? new Date(now.getFullYear(), now.getMonth(), now.getDate() - (days - 1)) : null;

  const inRange = orders
    .map((o) => ({ ...o, _date: toDate(o.createdAt) }))
    .filter((o) => o._date && (!start || o._date >= start));

  // Cancelled orders do not count as revenue
  const valid = inRange.filter((o) => !isCancelled(o));

  const revenue = valid.reduce((s, o) => s + orderRevenue(o), 0);
  const customers = new Set(valid.map((o) => o.userId).filter(Boolean));
  const repeatCustomers = [...customers].filter(
    (u) => valid.filter((o) => o.userId === u).length > 1
  ).length;

  const kpis = {
    revenue,
    orders: valid.length,
    avgOrderValue: valid.length ? revenue / valid.length : 0,
    customers: customers.size,
    repeatRate: customers.size ? (repeatCustomers / customers.size) * 100 : 0,
    cancelled: inRange.filter(isCancelled).length,
  };

  // Daily series with empty days filled in as zero
  const byDay = {};
  valid.forEach((o) => {
    const k = dayKey(o._date);
    byDay[k] = byDay[k] || { revenue: 0, orders: 0 };
    byDay[k].revenue += orderRevenue(o);
    byDay[k].orders += 1;
  });
  let first = start;
  if (!first && valid.length) first = new Date(Math.min(...valid.map((o) => o._date)));
  const daily = [];
  if (first) {
    const cursor = new Date(first.getFullYear(), first.getMonth(), first.getDate());
    while (cursor <= now) {
      const k = dayKey(cursor);
      daily.push({
        day: k,
        label: cursor.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: Math.round((byDay[k]?.revenue || 0) * 100) / 100,
        orders: byDay[k]?.orders || 0,
      });
      cursor.setDate(cursor.getDate() + 1);
    }
  }

  // Products and categories
  const productTotals = {};
  const categories = {};
  valid.forEach((o) => {
    (o.items || []).forEach((i) => {
      const name = itemName(i);
      const qty = itemQty(i);
      const refundRatio = orderTotal(o) > 0 ? orderRevenue(o) / orderTotal(o) : 1;
      const lineRevenue = itemPrice(i) * qty * refundRatio;
      productTotals[name] = productTotals[name] || { name, units: 0, revenue: 0 };
      productTotals[name].units += qty;
      productTotals[name].revenue += lineRevenue;
      const cat = i.category || categoryById[i.id] || 'Other';
      categories[cat] = categories[cat] || { name: cat, revenue: 0 };
      categories[cat].revenue += lineRevenue;
    });
  });
  const topProducts = Object.values(productTotals)
    .sort((a, b) => b.units - a.units)
    .slice(0, 5);
  const byCategory = Object.values(categories)
    .map((c) => ({ ...c, revenue: Math.round(c.revenue * 100) / 100 }))
    .sort((a, b) => b.revenue - a.revenue);

  // Orders by status (includes cancelled, so the admin sees them)
  const statuses = {};
  inRange.forEach((o) => {
    const s = o.status || 'Confirmed';
    statuses[s] = (statuses[s] || 0) + 1;
  });
  const byStatus = Object.entries(statuses).map(([name, count]) => ({ name, count }));

  const recent = [...inRange].sort((a, b) => b._date - a._date).slice(0, 8);

  return { kpis, daily, topProducts, byCategory, byStatus, recent };
}

export function ordersToCsv(orders) {
  const rows = [['Order ID', 'Customer ID', 'Date', 'Status', 'Items', 'Total']];
  orders.forEach((o) => {
    const d = toDate(o.createdAt);
    rows.push([
      o.id,
      o.userId || '',
      d ? d.toISOString() : '',
      o.status || '',
      (o.items || []).reduce((s, i) => s + itemQty(i), 0),
      orderTotal(o).toFixed(2),
    ]);
  });
  return rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
}

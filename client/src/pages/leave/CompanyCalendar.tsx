import { useEffect, useMemo, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { id } from 'date-fns/locale/id';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import leaveService from '../../services/leaveService';

type CalendarLeaveEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  employeeName: string;
  leaveType: string;
};

const locales = {
  id,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CompanyCalendar = () => {
  const [events, setEvents] = useState<CalendarLeaveEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCalendarData = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await leaveService.getCalendarData();
        const normalizedEvents = (Array.isArray(response) ? response : []).map((item: any) => ({
          id: item.id,
          title: item.title || `${item.employeeName || 'Unknown employee'} - ${item.leaveType || 'LEAVE'}`,
          start: new Date(item.start),
          end: new Date(item.end),
          allDay: true,
          employeeName: item.employeeName || 'Unknown employee',
          leaveType: item.leaveType || 'LEAVE',
        }));

        setEvents(normalizedEvents);
      } catch (err: any) {
        setError(err.message || 'Failed to load company calendar data.');
      } finally {
        setLoading(false);
      }
    };

    loadCalendarData();
  }, []);

  const eventStyleGetter = (event: CalendarLeaveEvent) => {
    const palette: Record<string, { backgroundColor: string; color: string }> = {
      PAID: { backgroundColor: '#2563eb', color: '#ffffff' },
      UNPAID: { backgroundColor: '#dc2626', color: '#ffffff' },
      APPROVED: { backgroundColor: '#0f766e', color: '#ffffff' },
    };

    const style = palette[event.leaveType] || palette.APPROVED;

    return {
      style: {
        backgroundColor: style.backgroundColor,
        color: style.color,
        borderRadius: '12px',
        border: 'none',
        padding: '4px 8px',
        boxShadow: '0 8px 20px rgba(15, 23, 42, 0.08)',
      },
    };
  };

  const eventContent = ({ event }: { event: CalendarLeaveEvent }) => (
    <div className="text-xs leading-tight">
      <div className="font-semibold">{event.employeeName}</div>
      <div className="opacity-90">{event.leaveType}</div>
    </div>
  );

  const fallbackMessage = useMemo(() => {
    if (loading) return 'Loading company calendar...';
    if (error) return error;
    if (!events.length) return 'No approved leaves found yet.';
    return '';
  }, [loading, error, events.length]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">Company Calendar</h3>
          <p className="text-sm text-slate-500">Approved leave entries shown only on the Leave Management page.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="h-3 w-3 rounded-full bg-blue-600" /> Paid
          <span className="ml-3 h-3 w-3 rounded-full bg-red-600" /> Unpaid
          <span className="ml-3 h-3 w-3 rounded-full bg-teal-700" /> Approved
        </div>
      </div>

      {fallbackMessage ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-600">
          {fallbackMessage}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <Calendar
            localizer={localizer}
            events={events}
            defaultView="month"
            views={['month', 'week', 'day', 'agenda']}
            startAccessor="start"
            endAccessor="end"
            allDayAccessor="allDay"
            popup
            tooltipAccessor={(event) => `${event.employeeName} • ${event.leaveType}`}
            eventPropGetter={eventStyleGetter}
            components={{ event: eventContent }}
            style={{ height: 780, padding: '16px', backgroundColor: '#ffffff' }}
          />
        </div>
      )}
    </section>
  );
};

export default CompanyCalendar;
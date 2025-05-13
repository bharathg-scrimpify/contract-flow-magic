
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

export type AttendanceStatus = "present" | "absent" | "late" | "excused" | undefined;

export interface AttendanceRecord {
  date: Date;
  status: AttendanceStatus;
  notes?: string;
}

interface AttendanceCalendarProps {
  attendanceRecords?: AttendanceRecord[];
  onMarkAttendance?: (date: Date, status: AttendanceStatus) => void;
  eventName?: string;
  readOnly?: boolean;
}

export function AttendanceCalendar({
  attendanceRecords = [],
  onMarkAttendance,
  eventName = "Event",
  readOnly = false,
}: AttendanceCalendarProps) {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    undefined
  );
  const [calendarOpen, setCalendarOpen] = React.useState(false);

  const attendanceMap = React.useMemo(() => {
    const map = new Map<string, AttendanceRecord>();
    attendanceRecords.forEach((record) => {
      map.set(format(record.date, "yyyy-MM-dd"), record);
    });
    return map;
  }, [attendanceRecords]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setCalendarOpen(false);
  };

  const handleMarkAttendance = (status: AttendanceStatus) => {
    if (!selectedDate || !onMarkAttendance) return;
    
    onMarkAttendance(selectedDate, status);
    
    toast({
      title: "Attendance Marked",
      description: `Marked as ${status} for ${format(selectedDate, "PPP")}`,
    });
  };

  const getStatusColor = (status: AttendanceStatus): string => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "absent":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "late":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case "excused":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getStatusLabel = (status: AttendanceStatus): string => {
    switch (status) {
      case "present":
        return "Present";
      case "absent":
        return "Absent";
      case "late":
        return "Late";
      case "excused":
        return "Excused";
      default:
        return "Not Marked";
    }
  };

  const getStatusIcon = (status: AttendanceStatus) => {
    switch (status) {
      case "present":
        return <Check className="h-4 w-4 text-green-600" />;
      case "absent":
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  // Custom day rendering function
  const renderDay = (day: Date, modifiers: any) => {
    const dateKey = format(day, "yyyy-MM-dd");
    const record = attendanceMap.get(dateKey);
    
    return (
      <div
        className={cn(
          "h-9 w-9 p-0 font-normal relative flex items-center justify-center",
          record?.status && "border-2",
          record?.status === "present" && "border-green-500",
          record?.status === "absent" && "border-red-500",
          record?.status === "late" && "border-amber-500",
          record?.status === "excused" && "border-blue-500"
        )}
      >
        {day.getDate()}
        {record?.status && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
            <div
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                record.status === "present" && "bg-green-500",
                record.status === "absent" && "bg-red-500",
                record.status === "late" && "bg-amber-500",
                record.status === "excused" && "bg-blue-500"
              )}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Attendance Calendar</span>
          <Badge variant="outline">{eventName}</Badge>
        </CardTitle>
        <CardDescription>
          Select a date and mark attendance status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-1.5">
          <label htmlFor="date" className="text-sm font-medium">
            Date
          </label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  format(selectedDate, "PPP")
                ) : (
                  <span>Select date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
                className="pointer-events-auto"
                modifiersClassNames={{
                  selected: "bg-blue-500 text-white",
                }}
                components={{
                  Day: ({ date, displayMonth, selected, ...props }: any) => {
                    const isSelected = selected;
                    return (
                      <TooltipProvider key={date.toString()}>
                        <Tooltip>
                          <TooltipTrigger tabIndex={-1} asChild>
                            <button
                              type="button"
                              {...props}
                              className={cn(props.className)}
                            >
                              {renderDay(date, { selected })}
                            </button>
                          </TooltipTrigger>
                          {attendanceMap.has(format(date, "yyyy-MM-dd")) && (
                            <TooltipContent>
                              <p>
                                {getStatusLabel(
                                  attendanceMap.get(format(date, "yyyy-MM-dd"))?.status
                                )}
                              </p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    );
                  },
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        {selectedDate && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">
              Attendance for {format(selectedDate, "PPP")}
            </h4>
            
            {!readOnly && (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  className={cn(
                    getStatusColor("present"),
                    attendanceMap.get(format(selectedDate, "yyyy-MM-dd"))?.status === "present" && "ring-2 ring-green-500"
                  )}
                  onClick={() => handleMarkAttendance("present")}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Present
                </Button>
                <Button
                  variant="outline"
                  className={cn(
                    getStatusColor("absent"),
                    attendanceMap.get(format(selectedDate, "yyyy-MM-dd"))?.status === "absent" && "ring-2 ring-red-500"
                  )}
                  onClick={() => handleMarkAttendance("absent")}
                >
                  <X className="mr-2 h-4 w-4" />
                  Absent
                </Button>
                <Button
                  variant="outline"
                  className={cn(
                    getStatusColor("late"),
                    attendanceMap.get(format(selectedDate, "yyyy-MM-dd"))?.status === "late" && "ring-2 ring-amber-500"
                  )}
                  onClick={() => handleMarkAttendance("late")}
                >
                  Late
                </Button>
                <Button
                  variant="outline"
                  className={cn(
                    getStatusColor("excused"),
                    attendanceMap.get(format(selectedDate, "yyyy-MM-dd"))?.status === "excused" && "ring-2 ring-blue-500"
                  )}
                  onClick={() => handleMarkAttendance("excused")}
                >
                  Excused
                </Button>
              </div>
            )}

            {readOnly && attendanceMap.has(format(selectedDate, "yyyy-MM-dd")) && (
              <div className="p-3 rounded-md border">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(attendanceMap.get(format(selectedDate, "yyyy-MM-dd"))?.status)}
                  <span className="font-medium">
                    {getStatusLabel(attendanceMap.get(format(selectedDate, "yyyy-MM-dd"))?.status)}
                  </span>
                </div>
                {attendanceMap.get(format(selectedDate, "yyyy-MM-dd"))?.notes && (
                  <p className="text-sm text-gray-500 mt-1">
                    {attendanceMap.get(format(selectedDate, "yyyy-MM-dd"))?.notes}
                  </p>
                )}
              </div>
            )}

            {readOnly && !attendanceMap.has(format(selectedDate, "yyyy-MM-dd")) && (
              <div className="p-3 rounded-md border border-dashed">
                <p className="text-sm text-gray-500">
                  No attendance record for this date
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-xs">Present</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <span className="text-xs">Absent</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-amber-500" />
            <span className="text-xs">Late</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-blue-500" />
            <span className="text-xs">Excused</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          {attendanceRecords.length} records
        </div>
      </CardFooter>
    </Card>
  );
}

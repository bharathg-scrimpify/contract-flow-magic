
import React, { useState } from 'react';
import { format, addDays } from 'date-fns';
import { AttendanceCalendar, AttendanceRecord, AttendanceStatus } from '@/components/attendance/AttendanceCalendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, RefreshCw, Upload, UserRound } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const generateMockAttendanceData = () => {
  const today = new Date();
  const records: AttendanceRecord[] = [];
  
  // Generate 30 days of sample attendance data
  for (let i = -15; i < 15; i++) {
    if (Math.random() > 0.3) { // Not all days have records
      const date = addDays(today, i);
      const rand = Math.random();
      let status: AttendanceStatus;
      
      if (rand > 0.85) status = "excused";
      else if (rand > 0.7) status = "late";
      else if (rand > 0.2) status = "present";
      else status = "absent";
      
      records.push({
        date,
        status,
        notes: status === "excused" ? "Medical appointment" : undefined
      });
    }
  }
  
  return records;
};

const AttendancePage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(generateMockAttendanceData);
  const [viewMode, setViewMode] = useState<'mark' | 'view'>('mark');
  
  const handleMarkAttendance = (date: Date, status: AttendanceStatus) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const existingIndex = attendanceRecords.findIndex(
      record => format(record.date, 'yyyy-MM-dd') === dateStr
    );
    
    if (existingIndex >= 0) {
      // Update existing record
      const updatedRecords = [...attendanceRecords];
      updatedRecords[existingIndex] = {
        ...updatedRecords[existingIndex],
        status
      };
      setAttendanceRecords(updatedRecords);
    } else {
      // Add new record
      setAttendanceRecords([
        ...attendanceRecords,
        { date, status }
      ]);
    }
  };

  const handleExportAttendance = () => {
    toast({
      title: "Attendance Exported",
      description: "Attendance data has been exported to CSV"
    });
  };
  
  const handleResetAttendance = () => {
    setAttendanceRecords(generateMockAttendanceData());
    toast({
      title: "Attendance Reset",
      description: "All attendance records have been reset"
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Attendance Management</h1>
          <Badge variant="outline" className="ml-2">Demo</Badge>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportAttendance}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={handleResetAttendance}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Tabs defaultValue="mark" value={viewMode} onValueChange={(v) => setViewMode(v as 'mark' | 'view')}>
            <TabsList className="mb-4">
              <TabsTrigger value="mark">Mark Attendance</TabsTrigger>
              <TabsTrigger value="view">View Attendance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="mark">
              <AttendanceCalendar 
                attendanceRecords={attendanceRecords}
                onMarkAttendance={handleMarkAttendance}
                eventName="Music Festival 2025"
              />
            </TabsContent>
            
            <TabsContent value="view">
              <AttendanceCalendar 
                attendanceRecords={attendanceRecords}
                eventName="Music Festival 2025"
                readOnly
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Attendance Summary</CardTitle>
              <CardDescription>Overview of attendance statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Present</span>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    {attendanceRecords.filter(r => r.status === 'present').length}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Absent</span>
                  </div>
                  <Badge variant="outline" className="bg-red-100 text-red-800">
                    {attendanceRecords.filter(r => r.status === 'absent').length}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span>Late</span>
                  </div>
                  <Badge variant="outline" className="bg-amber-100 text-amber-800">
                    {attendanceRecords.filter(r => r.status === 'late').length}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Excused</span>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    {attendanceRecords.filter(r => r.status === 'excused').length}
                  </Badge>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Attendance Rate</span>
                    <span className="text-sm font-medium">
                      {attendanceRecords.length > 0
                        ? Math.round(
                            (attendanceRecords.filter(r => r.status === 'present' || r.status === 'late').length / 
                            attendanceRecords.length) * 100
                          )
                        : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-600 h-2.5 rounded-full"
                      style={{
                        width: `${
                          attendanceRecords.length > 0
                            ? Math.round(
                                (attendanceRecords.filter(r => r.status === 'present' || r.status === 'late').length / 
                                attendanceRecords.length) * 100
                              )
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>People whose attendance is being tracked</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["Anna Johnson", "Michael Smith", "Sarah Davis", "James Wilson"].map((name, index) => (
                  <div key={index} className="flex items-center gap-3 py-2">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-800">
                      <UserRound className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{name}</p>
                      <p className="text-xs text-gray-500">
                        {["Singer", "Guitarist", "Sound Engineer", "Dancer"][index]}
                      </p>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full text-sm">
                  <Upload className="h-3 w-3 mr-2" />
                  Import Team Members
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;

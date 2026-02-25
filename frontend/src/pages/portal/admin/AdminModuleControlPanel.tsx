import { useState } from 'react';
import { PortalLayout } from '@/components/portal/PortalLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { moduleAccessApi } from '@/features/module-access/api';
import { toast } from 'sonner';
import { useQuery } from '@apollo/client/react';
import { GET_USERS } from '@/lib/graphql/queries';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

export default function AdminModuleControlPanel() {
  const [studentId, setStudentId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [moduleIndex, setModuleIndex] = useState(1);
  const [targetModuleIndex, setTargetModuleIndex] = useState(2);
  const [autoUnlockEnabled, setAutoUnlockEnabled] = useState(false);
  const [threshold, setThreshold] = useState(80);

  const { data: usersData, loading: loadingUsers } = useQuery(GET_USERS);

  const students = ((usersData as any)?.users || []).filter((user: any) => user.role === 'student');

  const runAction = async (action: () => Promise<any>, successMessage: string) => {
    try {
      await action();
      toast.success(successMessage);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Admin/Trainer Module Control Panel</h1>

        <Card>
          <CardHeader>
            <CardTitle>Manual Override</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Select student</p>
              <Select value={studentId} onValueChange={setStudentId}>
                <SelectTrigger>
                  <SelectValue placeholder={loadingUsers ? 'Loading students...' : 'Choose student'} />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student: any) => (
                    <SelectItem key={student.id} value={student.id}>
                      {(student.username || student.email)} ({student.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input placeholder="Course ID" value={courseId} onChange={(e) => setCourseId(e.target.value)} />
            <Input placeholder="Module Index" type="number" value={moduleIndex} onChange={(e) => setModuleIndex(Number(e.target.value))} />
            <div className="flex gap-2">
              <Button onClick={() => runAction(() => moduleAccessApi.unlockModule({ studentId, courseId, moduleIndex }), 'Module manually unlocked')}>Unlock Module</Button>
              <Button variant="secondary" onClick={() => runAction(() => moduleAccessApi.lockModule({ studentId, courseId, moduleIndex }), 'Module locked again')}>Lock Module</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Force Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Target Module Index" type="number" value={targetModuleIndex} onChange={(e) => setTargetModuleIndex(Number(e.target.value))} />
            <Button onClick={() => runAction(() => moduleAccessApi.forceProgress({ studentId, courseId, targetModuleIndex }), 'Student forced to target module')}>Force Progress</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Auto Unlock Mode</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between border rounded-lg p-3">
              <p className="text-sm">Enable auto unlock when score is above threshold</p>
              <Switch checked={autoUnlockEnabled} onCheckedChange={setAutoUnlockEnabled} />
            </div>
            <Input type="number" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} placeholder="Score threshold" />
            <Button onClick={() => runAction(() => moduleAccessApi.updateAutoUnlockConfig({ courseId, autoUnlockEnabled, autoUnlockScoreThreshold: threshold }), 'Auto unlock mode updated')}>Save Auto Unlock Config</Button>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}

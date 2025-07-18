"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Progress } from "@workspace/ui/components/progress";
import { Clock, Plus, Check, LogOut } from "lucide-react";
import { AddMedicationDialog } from "./add-medication-dialog";
import { FamilyFeed } from "./family-feed";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
  color: string;
}

interface FeedItem {
  id: string;
  user: {
    name: string;
    avatar: string;
    relation: string;
  };
  medication: string;
  time: string;
  message?: string;
  likes: number;
  comments: number;
}

export function Dashboard() {
  const { data: session } = useSession();
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: "1",
      name: "혈압약",
      dosage: "1정",
      time: "08:00",
      taken: false,
      color: "bg-blue-500",
    },
    {
      id: "2",
      name: "비타민D",
      dosage: "2정",
      time: "12:00",
      taken: true,
      color: "bg-yellow-500",
    },
    {
      id: "3",
      name: "오메가3",
      dosage: "1캡슐",
      time: "20:00",
      taken: false,
      color: "bg-green-500",
    },
  ]);

  const [feedItems, setFeedItems] = useState<FeedItem[]>([
    {
      id: "1",
      user: {
        name: "엄마",
        avatar: "/placeholder.svg?height=40&width=40",
        relation: "어머니",
      },
      medication: "혈압약",
      time: "2시간 전",
      message: "오늘도 건강하게 복용했어요! 💊",
      likes: 3,
      comments: 1,
    },
    {
      id: "2",
      user: {
        name: "아빠",
        avatar: "/placeholder.svg?height=40&width=40",
        relation: "아버지",
      },
      medication: "당뇨약",
      time: "4시간 전",
      likes: 2,
      comments: 0,
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const takeMedication = (id: string) => {
    setMedications((prev) =>
      prev.map((med) => (med.id === id ? { ...med, taken: true } : med))
    );

    // 피드에 새 항목 추가
    const medication = medications.find((med) => med.id === id);
    if (medication) {
      const newFeedItem: FeedItem = {
        id: Date.now().toString(),
        user: {
          name: "나",
          avatar: "/placeholder.svg?height=40&width=40",
          relation: "본인",
        },
        medication: medication.name,
        time: "방금 전",
        likes: 0,
        comments: 0,
      };
      setFeedItems((prev) => [newFeedItem, ...prev]);
    }
  };

  const completedCount = medications.filter((med) => med.taken).length;
  const totalCount = medications.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">복약 알림</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              복약 추가
            </Button>
            <Button
              variant="outline"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="w-4 h-4 mr-2" />
              로그아웃
            </Button>
          </div>
        </div>
        <div>
          <p className="text-gray-600">{session?.user?.name}님, 안녕하세요!</p>
        </div>
        {/* Progress Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              오늘의 복약 현황
            </CardTitle>
            <CardDescription>
              {completedCount}/{totalCount} 완료
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progressPercentage} className="mb-2" />
            <p className="text-sm text-gray-600">
              {totalCount - completedCount}개의 복약이 남았습니다
            </p>
          </CardContent>
        </Card>

        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="today">오늘의 복약</TabsTrigger>
            <TabsTrigger value="feed">가족 피드</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4">
            {medications.map((medication) => (
              <Card key={medication.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${medication.color}`}
                      />
                      <div>
                        <h3 className="font-medium">{medication.name}</h3>
                        <p className="text-sm text-gray-600">
                          {medication.dosage} • {medication.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {medication.taken ? (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800"
                        >
                          <Check className="w-3 h-3 mr-1" />
                          복용 완료
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => takeMedication(medication.id)}
                        >
                          복용 완료
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="feed">
            <FamilyFeed feedItems={feedItems} setFeedItems={setFeedItems} />
          </TabsContent>
        </Tabs>
      </div>

      <AddMedicationDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddMedication={(medication) => {
          setMedications((prev) => [
            ...prev,
            {
              ...medication,
              id: Date.now().toString(),
              taken: false,
            },
          ]);
        }}
      />
    </div>
  );
}

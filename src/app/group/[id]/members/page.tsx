"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, User, Banknote, Smartphone, Building2 } from "lucide-react";
import {
  Button,
  Input,
  Textarea,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  RadioGroup,
  RadioOption,
} from "@/components/ui";
import { useGroupStore } from "@/stores/groupStore";
import { useHydration } from "@/stores/useHydration";
import type { PaymentMethod, Member } from "@/types";
import { cn } from "@/lib/utils";

const paymentMethodConfig = {
  cash: {
    icon: Banknote,
    label: "現金",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  paypay: {
    icon: Smartphone,
    label: "PayPay",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  bank: {
    icon: Building2,
    label: "振込",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
};

function MemberCard({
  member,
  onUpdate,
  onDelete,
  canDelete,
}: {
  member: Member;
  onUpdate: (data: {
    name?: string;
    paymentMethod?: PaymentMethod;
    paymentInfo?: string;
  }) => void;
  onDelete: () => void;
  canDelete: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(member.name);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    member.paymentMethod
  );
  const [paymentInfo, setPaymentInfo] = useState(member.paymentInfo || "");

  const handleSave = () => {
    onUpdate({
      name: name.trim(),
      paymentMethod,
      paymentInfo: paymentInfo.trim() || undefined,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(member.name);
    setPaymentMethod(member.paymentMethod);
    setPaymentInfo(member.paymentInfo || "");
    setIsEditing(false);
  };

  const methodConfig = paymentMethodConfig[member.paymentMethod];
  const MethodIcon = methodConfig.icon;

  return (
    <Card>
      <CardContent className="p-3 sm:p-4">
        {isEditing ? (
          <div className="space-y-4">
            <Input
              label="メンバー名"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
            />

            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                希望する受取方法
              </label>
              <RadioGroup
                name={`payment-${member.id}`}
                value={paymentMethod}
                onChange={(v) => setPaymentMethod(v as PaymentMethod)}
              >
                <RadioOption value="cash">現金</RadioOption>
                <RadioOption value="paypay">PayPay</RadioOption>
                <RadioOption value="bank">口座振り込み</RadioOption>
              </RadioGroup>
            </div>

            {paymentMethod === "paypay" && (
              <Input
                label="PayPay電話番号"
                placeholder="090-1234-5678"
                value={paymentInfo}
                onChange={(e) => setPaymentInfo(e.target.value)}
              />
            )}

            {paymentMethod === "bank" && (
              <Textarea
                label="振込先口座情報"
                placeholder={`○○銀行 △△支店\n普通 1234567\n名義: ヤマダ タロウ`}
                value={paymentInfo}
                onChange={(e) => setPaymentInfo(e.target.value)}
                rows={4}
              />
            )}

            <div className="flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={handleCancel}>
                キャンセル
              </Button>
              <Button size="sm" onClick={handleSave}>
                保存
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <div className="min-w-0">
                <h3 className="font-medium text-[var(--color-text)] truncate">
                  {member.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                      methodConfig.bgColor,
                      methodConfig.color
                    )}
                  >
                    <MethodIcon className="w-3 h-3" />
                    {methodConfig.label}
                  </span>
                  {member.paymentInfo && (
                    <span className="text-xs text-[var(--color-text-muted)] truncate">
                      {member.paymentInfo}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="touch-manipulation"
              >
                編集
              </Button>
              {canDelete && (
                <Button variant="ghost" size="sm" onClick={onDelete} className="touch-manipulation">
                  <Trash2 className="w-4 h-4 text-[var(--color-error)]" />
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function MembersPage() {
  const params = useParams();
  const groupId = params.id as string;

  const hydrated = useHydration();
  const [newMemberName, setNewMemberName] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // 直接stateから取得してuseMemoでメモ化
  const groups = useGroupStore((state) => state.groups);
  const allMembers = useGroupStore((state) => state.members);

  const group = useMemo(() => groups.find((g) => g.id === groupId), [groups, groupId]);
  const members = useMemo(() => allMembers.filter((m) => m.groupId === groupId), [allMembers, groupId]);

  const addMember = useGroupStore((state) => state.addMember);
  const updateMember = useGroupStore((state) => state.updateMember);
  const deleteMember = useGroupStore((state) => state.deleteMember);

  if (!hydrated) {
    return (
      <main className="min-h-screen py-6 px-4">
        <div className="max-w-lg mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </main>
    );
  }

  if (!group) {
    return (
      <main className="min-h-screen py-6 px-4">
        <div className="max-w-lg mx-auto text-center py-16">
          <h1 className="text-2xl font-bold text-[var(--color-text)] mb-4">
            グループが見つかりません
          </h1>
          <Link href="/">
            <Button>トップに戻る</Button>
          </Link>
        </div>
      </main>
    );
  }

  const handleAddMember = () => {
    const trimmed = newMemberName.trim();
    if (!trimmed) return;

    if (members.some((m) => m.name === trimmed)) {
      alert("同じ名前のメンバーが既に存在します");
      return;
    }

    addMember(groupId, trimmed);
    setNewMemberName("");
    setShowAddForm(false);
  };

  const handleUpdateMember = (
    id: string,
    data: {
      name?: string;
      paymentMethod?: PaymentMethod;
      paymentInfo?: string;
    }
  ) => {
    updateMember(id, data);
  };

  const handleDeleteMember = (id: string, name: string) => {
    if (
      confirm(
        `${name}を削除しますか？このメンバーに関連する立て替えの参加者からも削除されます。`
      )
    ) {
      deleteMember(id);
    }
  };

  return (
    <main className="min-h-screen py-4 sm:py-6 px-3 sm:px-4 pb-8">
      <div className="max-w-lg mx-auto">
        {/* ヘッダー */}
        <div className="mb-4 sm:mb-6">
          <Link
            href={`/group/${groupId}`}
            className="inline-flex items-center gap-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors mb-3 touch-manipulation"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">グループに戻る</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text)]">
            メンバー設定
          </h1>
          <p className="text-[var(--color-text-muted)] mt-1 text-sm">{group.name}</p>
        </div>

        {/* メンバー追加 */}
        {showAddForm ? (
          <Card className="mb-4 sm:mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">メンバーを追加</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex gap-2">
                <Input
                  placeholder="メンバー名"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  maxLength={50}
                  onKeyDown={(e) => e.key === "Enter" && handleAddMember()}
                  className="flex-1"
                />
                <Button onClick={handleAddMember} className="shrink-0">追加</Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewMemberName("");
                  }}
                  className="shrink-0"
                >
                  ×
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Button
            variant="secondary"
            className="w-full mb-4 sm:mb-6 touch-manipulation"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            メンバーを追加
          </Button>
        )}

        {/* メンバー一覧 */}
        <div className="space-y-2 sm:space-y-3">
          {members.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onUpdate={(data) => handleUpdateMember(member.id, data)}
              onDelete={() => handleDeleteMember(member.id, member.name)}
              canDelete={members.length > 2}
            />
          ))}
        </div>

        {members.length <= 2 && (
          <p className="text-sm text-[var(--color-text-muted)] text-center mt-4">
            メンバーは最低2名必要です
          </p>
        )}
      </div>
    </main>
  );
}

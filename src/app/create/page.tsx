"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import { Button, Input, Card, CardContent } from "@/components/ui";
import { TagInput } from "@/components/TagInput";
import { useGroupStore } from "@/stores/groupStore";
import { useHydration } from "@/stores/useHydration";

export default function CreateGroupPage() {
  const router = useRouter();
  useHydration(); // ストアをhydrate
  const createGroup = useGroupStore((state) => state.createGroup);

  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ name?: string; members?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: { name?: string; members?: string } = {};

    if (!groupName.trim()) {
      newErrors.name = "グループ名を入力してください";
    } else if (groupName.length > 100) {
      newErrors.name = "グループ名は100文字以内で入力してください";
    }

    if (members.length < 2) {
      newErrors.members = "メンバーは2名以上追加してください";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const groupId = await createGroup(groupName.trim(), members);
      router.push(`/group/${groupId}`);
    } catch {
      setErrors({ name: "グループの作成に失敗しました" });
      setIsSubmitting(false);
    }
  };

  const handleAddMember = (name: string) => {
    if (name.length > 50) {
      setErrors((prev) => ({
        ...prev,
        members: "メンバー名は50文字以内で入力してください",
      }));
      return;
    }
    setMembers([...members, name]);
    setErrors((prev) => ({ ...prev, members: undefined }));
  };

  const handleRemoveMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">トップに戻る</span>
          </Link>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            グループを作成
          </h1>
          <p className="text-[var(--color-text-muted)] mt-1">
            グループ名とメンバーを入力してください
          </p>
        </div>

        {/* フォーム */}
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* グループ名 */}
              <Input
                label="グループ名"
                placeholder="例: 沖縄旅行2024"
                value={groupName}
                onChange={(e) => {
                  setGroupName(e.target.value);
                  if (errors.name) {
                    setErrors((prev) => ({ ...prev, name: undefined }));
                  }
                }}
                error={errors.name}
                maxLength={100}
              />

              {/* メンバー */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                  メンバー
                </label>
                <TagInput
                  tags={members}
                  onAddTag={handleAddMember}
                  onRemoveTag={handleRemoveMember}
                  placeholder="メンバー名を入力してEnter"
                  error={errors.members}
                />
                <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
                  メンバー名を入力してEnterで追加（2名以上必要）
                </p>
              </div>

              {/* メンバープレビュー */}
              {members.length > 0 && (
                <div className="p-4 rounded-lg bg-[var(--color-base)]">
                  <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-2">
                    <Users className="w-4 h-4" />
                    <span>{members.length}名のメンバー</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {members.map((member, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-white text-sm text-[var(--color-text)] border border-[var(--color-border)]"
                      >
                        {member}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 送信ボタン */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting}
                isLoading={isSubmitting}
              >
                グループを作成
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 注意事項 */}
        <div className="mt-6 p-4 rounded-lg bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/20">
          <p className="text-sm text-[var(--color-text)]">
            <strong>ご注意:</strong>{" "}
            グループのURLを知っている人は誰でもアクセスできます。
            URLの共有は信頼できる相手にのみ行ってください。
          </p>
        </div>
      </div>
    </main>
  );
}

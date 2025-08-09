'use client';

import { useState } from 'react';
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Checkbox } from "@/components/admin/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/admin/ui/table";

export default function CandidatePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([]);

  // 候補者データのサンプル
  const candidateData = Array(25).fill(null).map((_, index) => ({
    id: index + 1,
    lastLoginDate: 'yyyy/mm/dd',
    lastLoginTime: 'hh:mm',
    userIdText: 'ユーザーIDテキスト',
    userName: 'ユーザー名が入ります。',
    occupation: '職業種',
    gender: '男性',
    age: '40',
    salary: '1000〜1100万',
    phone: '08012345678',
    email: 'name@example.com',
    location: '東京都渋谷区テキスト'
  }));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCandidates(candidateData.map(c => c.id));
    } else {
      setSelectedCandidates([]);
    }
  };

  const handleSelectCandidate = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedCandidates([...selectedCandidates, id]);
    } else {
      setSelectedCandidates(selectedCandidates.filter(cId => cId !== id));
    }
  };

  return (
    <div className="min-h-screen">
      {/* 上部の機能エリア */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <div className="text-red-500 text-sm">
            <div>業種</div>
            <div>ユーザーID</div>
            <div>年齢</div>
            <div>性別</div>
            <div>年収</div>
            <div>部分一致で検索</div>
          </div>
          
          <div className="flex items-center gap-2">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="検索"
              className="w-60 border border-gray-400"
              style={{
                fontFamily: 'Inter',
                fontSize: '16px',
                fontWeight: 700,
                lineHeight: 1.6
              }}
            />
            <Button className="bg-black text-white px-4 py-2 rounded">
              検索
            </Button>
          </div>
          
          <div className="text-red-500 text-sm">
            <div>部分一致で検索</div>
            <div>↓各項目は以下のように作成できます。チェックを複数選択での削除機能、メールアドレス、更新の全確認</div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <Button className="bg-black text-white px-6 py-2 rounded-full">
            新規追加
          </Button>
          <Button className="bg-white border border-black text-black px-6 py-2 rounded-full">
            CSVダウンロード
          </Button>
        </div>
      </div>

      {/* 候補者一覧テーブル */}
      <div className="bg-white border border-gray-300 rounded">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="border-r border-gray-300 px-3 py-2 w-12">
                <Checkbox 
                  checked={selectedCandidates.length === candidateData.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="border-r border-gray-300 px-3 py-2">
                <div className="flex items-center gap-1">
                  <span style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6,
                    color: '#000'
                  }}>
                    最終ログイン日時
                  </span>
                  {/* Sort icon placeholder */}
                </div>
              </TableHead>
              <TableHead className="border-r border-gray-300 px-3 py-2">
                <div className="flex items-center gap-1">
                  <span style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6,
                    color: '#000'
                  }}>
                    ユーザーID
                  </span>
                  {/* Sort icon placeholder */}
                </div>
              </TableHead>
              <TableHead className="border-r border-gray-300 px-3 py-2">
                <div className="flex items-center gap-1">
                  <span style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6,
                    color: '#000'
                  }}>
                    ユーザー名
                  </span>
                  {/* Sort icon placeholder */}
                </div>
              </TableHead>
              <TableHead className="border-r border-gray-300 px-3 py-2">
                <div className="flex items-center gap-1">
                  <span style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6,
                    color: '#000'
                  }}>
                    住まい
                  </span>
                  {/* Sort icon placeholder */}
                </div>
              </TableHead>
              <TableHead className="border-r border-gray-300 px-3 py-2">
                <div className="flex items-center gap-1">
                  <span style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6,
                    color: '#000'
                  }}>
                    性別
                  </span>
                  {/* Sort icon placeholder */}
                </div>
              </TableHead>
              <TableHead className="border-r border-gray-300 px-3 py-2">
                <div className="flex items-center gap-1">
                  <span style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6,
                    color: '#000'
                  }}>
                    年齢
                  </span>
                  {/* Sort icon placeholder */}
                </div>
              </TableHead>
              <TableHead className="border-r border-gray-300 px-3 py-2">
                <div className="flex items-center gap-1">
                  <span style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6,
                    color: '#000'
                  }}>
                    年収希望
                  </span>
                  {/* Sort icon placeholder */}
                </div>
              </TableHead>
              <TableHead className="border-r border-gray-300 px-3 py-2">
                <div className="flex items-center gap-1">
                  <span style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6,
                    color: '#000'
                  }}>
                    電話番号
                  </span>
                  {/* Sort icon placeholder */}
                </div>
              </TableHead>
              <TableHead className="border-r border-gray-300 px-3 py-2">
                <div className="flex items-center gap-1">
                  <span style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6,
                    color: '#000'
                  }}>
                    メールアドレス
                  </span>
                  {/* Sort icon placeholder */}
                </div>
              </TableHead>
              <TableHead className="px-3 py-2">
                <div className="flex items-center gap-1">
                  <span style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6,
                    color: '#000'
                  }}>
                    最後の住所情報
                  </span>
                  {/* Sort icon placeholder */}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidateData.map((candidate, index) => (
              <TableRow key={candidate.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <TableCell className="border-r border-gray-200 px-3 py-4">
                  <Checkbox 
                    checked={selectedCandidates.includes(candidate.id)}
                    onCheckedChange={(checked) => handleSelectCandidate(candidate.id, checked as boolean)}
                  />
                </TableCell>
                <TableCell className="border-r border-gray-200 px-3 py-4" style={{
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: 1.6
                }}>
                  <div>{candidate.lastLoginDate}</div>
                  <div>{candidate.lastLoginTime}</div>
                </TableCell>
                <TableCell className="border-r border-gray-200 px-3 py-4" style={{
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: 1.6
                }}>
                  {candidate.userIdText}
                </TableCell>
                <TableCell className="border-r border-gray-200 px-3 py-4" style={{
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: 1.6
                }}>
                  {candidate.userName}
                </TableCell>
                <TableCell className="border-r border-gray-200 px-3 py-4" style={{
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: 1.6
                }}>
                  {candidate.occupation}
                </TableCell>
                <TableCell className="border-r border-gray-200 px-3 py-4" style={{
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: 1.6
                }}>
                  {candidate.gender}
                </TableCell>
                <TableCell className="border-r border-gray-200 px-3 py-4" style={{
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: 1.6
                }}>
                  {candidate.age}
                </TableCell>
                <TableCell className="border-r border-gray-200 px-3 py-4" style={{
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: 1.6
                }}>
                  {candidate.salary}
                </TableCell>
                <TableCell className="border-r border-gray-200 px-3 py-4" style={{
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: 1.6
                }}>
                  {candidate.phone}
                </TableCell>
                <TableCell className="border-r border-gray-200 px-3 py-4" style={{
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: 1.6
                }}>
                  {candidate.email}
                </TableCell>
                <TableCell className="px-3 py-4" style={{
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: 1.6
                }}>
                  {candidate.location}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ページネーション */}
      <div className="flex justify-center gap-4 mt-6">
        <Button className="bg-black text-white px-6 py-2 rounded-full">
          前へ
        </Button>
        <Button className="bg-black text-white px-6 py-2 rounded-full">
          次へ
        </Button>
      </div>
    </div>
  );
}
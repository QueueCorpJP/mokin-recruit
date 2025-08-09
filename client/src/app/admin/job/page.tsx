import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";
import { Badge } from "@/components/admin/ui/badge";
import { Button } from "@/components/admin/ui/button";
import { Card, CardContent } from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/admin/ui/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/admin/ui/breadcrumb";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function Job() {
  // Breadcrumb items data
  const breadcrumbItems = [
    { text: "テキスト4", href: "#" },
    { text: "テキスト3", href: "#" },
    { text: "テキスト2", href: "#" },
    { text: "テキスト１", href: "#", current: true },
  ];

  // Data for select options
  const selectOptions = [{ value: "not-selected", label: "未選択" }];

  // Column headers data
  const columns = [
    { id: 1, title: "項目名テキスト", width: "w-[159px]" },
    { id: 2, title: "テキスト", width: "w-[101px]" },
    { id: 3, title: "テキスト", width: "w-[101px]" },
    { id: 4, title: "項目名テキスト", width: "flex-1" },
  ];

  // Row data
  const rows = Array(9).fill({
    date: "yyyy/mm/dd hh:mm",
    tag1: "テキスト",
    tag2: "テキスト",
    description:
      "テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。",
  });

  // Table data structure for bottom table
  const tableHeaders = ["", "テキスト", "テキスト", "テキスト", "テキスト"];
  const tableRows = [
    { id: 1, label: "テキスト", values: ["0", "0", "0", "0"] },
    { id: 2, label: "テキスト", values: ["0", "0", "0", "0"] },
    { id: 3, label: "テキスト", values: ["0", "0", "0", "0"] },
  ];

  return (
    <div>
      <main className="flex flex-col items-center gap-10 pt-10 pb-20  w-full max-w-[900px] bg-[#F9F9F9]">
      {/* Navigation Section */}
      <div className="flex flex-col items-start gap-4 w-full">
        <Breadcrumb>
          <BreadcrumbList className="flex flex-wrap gap-2 items-center">
            {breadcrumbItems.map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={item.href}
                    className={`font-bold font-[number:var(--bold-font-weight)] text-o6qb-cf text-[length:var(--bold-font-size)] tracking-[var(--bold-letter-spacing)] leading-[var(--bold-line-height)] whitespace-nowrap [font-style:var(--bold-font-style)]`}
                  >
                    {item.text}
                  </BreadcrumbLink>
                </BreadcrumbItem>

                {index < breadcrumbItems.length - 1 && (
                  <BreadcrumbSeparator>
                    <ChevronRightIcon className="w-2 h-2" />
                  </BreadcrumbSeparator>
                )}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col items-start gap-4 w-full">
          <div className="flex items-center gap-4 w-full">
            <h1 className="flex-1 mt-[-1.00px] font-h2-bold font-[number:var(--h2-bold-font-weight)] text-o6qb-cf text-[length:var(--h2-bold-font-size)] tracking-[var(--h2-bold-letter-spacing)] leading-[var(--h2-bold-line-height)] [font-style:var(--h2-bold-font-style)]">
              テキスト
            </h1>
          </div>
        </div>
      </div>

      {/* Data Display Section */}
      <div className="flex items-center justify-between w-full gap-4">
        <div className="flex items-center gap-6">
          {/* Dropdown select */}
          <Select defaultValue="not-selected">
            <SelectTrigger className="w-60 bg-ah-7i-yd border-[#999999] font-bold text-o6qb-cf">
              <SelectValue placeholder="未選択" />
            </SelectTrigger>
            <SelectContent>
              {selectOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Search input and button */}
          <div className="flex items-center gap-2">
            <Input
              className="w-60 px-[11px] py-1 bg-ah-7i-yd border-[#999999] font-[number:var(---font-weight)] text-x-3 text-[length:var(---font-size)] tracking-[var(---letter-spacing)] leading-[var(---line-height)] [font-family:var(---font-family)] [font-style:var(---font-style)]"
              placeholder="キーワード検索"
            />
            <Button className="rounded-[32px] bg-[linear-gradient(45deg,rgba(25,141,118,1)_0%,rgba(28,167,79,1)_100%)] text-ah-7i-yd font-bold">
              検索
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Outline button */}
          <Button
            variant="outline"
            className="min-w-40 px-10 py-3.5 rounded-[32px] border-[#0f9058] text-h-7-4c-11 font-bold"
          >
            テキスト
          </Button>

          {/* Filled button */}
          <Button className="min-w-40 px-10 py-3.5 rounded-[32px] bg-[linear-gradient(45deg,rgba(25,141,118,1)_0%,rgba(28,167,79,1)_100%)] shadow-[var(--)] text-ah-7i-yd font-bold">
            テキスト
          </Button>
        </div>
      </div>

      {/* Data Entry Section */}
      <section className="flex flex-col items-start gap-6 w-full">
        <div className="flex flex-col items-start gap-2 w-full">
          {/* Table header */}
          <div className="w-full border-b border-[#dcdcdc]">
            <Table>
              <TableHeader>
                <TableRow className="px-10 py-2">
                  {columns.map((column) => (
                    <TableHead
                      key={column.id}
                      className={`${column.width} flex items-center gap-2 font-bold font-[number:var(--bold-font-weight)] text-o6qb-cf text-[length:var(--bold-font-size)] tracking-[var(--bold-letter-spacing)] leading-[var(--bold-line-height)]`}
                    >
                      {column.title}
                      <div className="flex flex-col w-2.5 items-start">
                        <img className="w-2 h-2" alt="Up" src="/up.svg" />
                        <img className="w-2 h-2" alt="Down" src="/down.svg" />
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
            </Table>
          </div>

          {/* Data rows */}
          {rows.map((row, index) => (
            <Card
              key={`row-${index}`}
              className="w-full bg-ah-7i-yd rounded-[10px] border-b border-[#efefef] shadow-drop-shadow"
            >
              <CardContent className="flex flex-wrap items-center gap-[24px_24px] px-10 py-5">
                {/* Date */}
                <div className="w-fit [font-family:var(---font-family)] font-[number:var(---font-weight)] text-o6qb-cf text-[length:var(---font-size)] tracking-[var(---letter-spacing)] leading-[var(---line-height)] whitespace-nowrap [font-style:var(---font-style)]">
                  <span className="font-[number:var(---font-weight)] tracking-[var(---letter-spacing)] [font-family:var(---font-family)] [font-style:var(---font-style)] leading-[var(---line-height)] text-[length:var(---font-size)]">
                    {row.date.split(" ")[0]}{" "}
                  </span>
                  <span className="font-[number:var(---font-weight)] tracking-[var(---letter-spacing)] [font-family:var(---font-family)] [font-style:var(---font-style)] leading-[var(---line-height)] text-[length:var(---font-size)]">
                    {row.date.split(" ")[1]}
                  </span>
                </div>

                {/* Tag 1 */}
                <Badge className="px-4 py-0 bg-h-7-4c-11 rounded-[5px] font-normal hover:bg-h-7-4c-11">
                  <span className="w-fit mt-[-2.00px] font-[number:var(---font-weight)] text-ah-7i-yd text-[length:var(---font-size)] text-center tracking-[var(---letter-spacing)] leading-[var(---line-height)] whitespace-nowrap [font-family:var(---font-family)] [font-style:var(---font-style)]">
                    {row.tag1}
                  </span>
                </Badge>

                {/* Tag 2 */}
                <Badge className="px-4 py-0 bg-v-HN-jy-1 rounded-[5px] font-normal hover:bg-v-HN-jy-1">
                  <span className="w-fit mt-[-2.00px] font-[number:var(---font-weight)] text-h-7-4c-11 text-[length:var(---font-size)] text-center tracking-[var(---letter-spacing)] leading-[var(---line-height)] whitespace-nowrap [font-family:var(---font-family)] [font-style:var(---font-style)]">
                    {row.tag2}
                  </span>
                </Badge>

                {/* Description */}
                <div className="flex-1 h-5 font-[number:var(---font-weight)] text-o6qb-cf text-[length:var(---font-size)] tracking-[var(---letter-spacing)] leading-[var(---line-height)] whitespace-nowrap overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:0] [-webkit-box-orient:vertical] [font-family:var(---font-family)] [font-style:var(---font-style)]">
                  {row.description}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  <Button className="px-4 py-1 h-auto bg-h-7-4c-11 rounded-[32px] font-bold font-[number:var(--bold-font-weight)] text-ah-7i-yd text-[length:var(--bold-font-size)] tracking-[var(--bold-letter-spacing)] leading-[var(--bold-line-height)] hover:bg-h-7-4c-11/90">
                    編集
                  </Button>
                  <Button className="px-4 py-1 h-auto bg-w-WJ-oo-z rounded-[32px] font-bold font-[number:var(--bold-font-weight)] text-ah-7i-yd text-[length:var(--bold-font-size)] tracking-[var(--bold-letter-spacing)] leading-[var(--bold-line-height)] hover:bg-w-WJ-oo-z/90">
                    削除
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Navigation buttons */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="w-14 h-14 rounded-full border border-[#0f9058]"
          aria-label="Left navigation"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="w-14 h-14 rounded-full border border-[#0f9058]"
          aria-label="Right navigation"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Data Table Section */}
      <div className="w-full rounded overflow-hidden border border-solid border-[#efefef] bg-ah-7i-yd">
        <Table>
          <TableHeader className="bg-ao-jew-r">
            <TableRow>
              {tableHeaders.map((header, index) => (
                <TableHead
                  key={`header-${index}`}
                  className="px-3 py-2.5 font-[number:var(---font-weight)] text-o6qb-cf text-[length:var(---font-size)] tracking-[var(---letter-spacing)] leading-[var(---line-height)] [font-family:var(---font-family)] [font-style:var(---font-style)] border-t border-l border-[#efefef] bg-x-2"
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableRows.map((row) => (
              <TableRow key={`row-${row.id}`} className="bg-ao-jew-r">
                <TableCell className="px-3 py-2.5 font-[number:var(---font-weight)] text-o6qb-cf text-[length:var(---font-size)] tracking-[var(---letter-spacing)] leading-[var(---line-height)] [font-family:var(---font-family)] [font-style:var(---font-style)] border-t border-l border-[#efefef] bg-ah-7i-yd">
                  {row.label}
                </TableCell>
                {row.values.map((value, index) => (
                  <TableCell
                    key={`cell-${row.id}-${index}`}
                    className="px-3 py-2.5 font-[number:var(---font-weight)] text-o6qb-cf text-[length:var(---font-size)] tracking-[var(---letter-spacing)] leading-[var(---line-height)] [font-family:var(---font-family)] [font-style:var(---font-style)] border-t border-l border-[#efefef] bg-ah-7i-yd"
                  >
                    {value}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
    </div>
  );
}
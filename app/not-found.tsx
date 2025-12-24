import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { RocketIcon } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <RocketIcon className="text-9xl" size={400} />
        </EmptyMedia>

        <EmptyTitle className="text-9xl font-semibold">404</EmptyTitle>
        <EmptyDescription className="text-lg">
          Oops! this page you are looking for is not found
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Link href="/">
            <Button className="cursor-pointer">Back to home</Button>
          </Link>
        </div>
      </EmptyContent>
    </Empty>
  );
}

'use client'

import * as z from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { CommentValidation } from "@/lib/validations/thread";
import { usePathname, useRouter } from "next/navigation";
import { addCommentToThread } from "@/lib/actions/thread.actions";
import Image from "next/image";

interface CommentProps {
  threadId: string,
  currentUserImg: string,
  currentUserId: string;
}

export default function Comment({ threadId, currentUserId, currentUserImg }: CommentProps) {

  const pathname = usePathname();

  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addCommentToThread(
      threadId, 
      values.thread, 
      JSON.parse(currentUserId), 
      pathname
    );

    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-start gap-10">
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="items-center flex gap-3 w-full">
              <FormLabel>
                <Image  
                  src={currentUserImg}
                  alt="Profile Image"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  type="text"
                  placeholder="Comment..."
                  className="no-focus text-light-1 outline-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="comment-form_btn">
          Reply
        </Button>
      </form>
    </Form>
  )
}

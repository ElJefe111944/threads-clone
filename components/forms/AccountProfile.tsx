'use client'

import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form
} from "@/components/ui/form"

interface UserProps {
    user: {
        id: string;
        objectId: string;
        username: string;
        name: string;
        bio: string;
        image: string
    };
    btnTitle: string;
}

const AccountProfile = ({ user, btnTitle }): UserProps => {
  
  const form = useForm({
    resolver
  });
  
  return (    
    <Form>

    </Form>
  )
}

export default AccountProfile
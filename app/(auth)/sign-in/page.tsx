'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react";
import { useDebounceCallback } from 'usehooks-ts'
import { redirect, useRouter } from "next/navigation";
import { signUpSchema } from "@/src/schemas/signUpSchema";
import axios, {AxiosError} from "axios";
import { toast } from "sonner"
import { ApiResponse } from "@/src/types/ApiResponse";
import {Field,FieldLabel} from "@/components/ui/field"
import { Input } from "@base-ui/react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/src/schemas/signInSchema";
import { signIn } from "next-auth/react";

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  // toast
  const router = useRouter();

  //zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password
    })
        if (result?.error) {
          if (result.error === 'CredentialsSignin') {
            toast.error('Login Failed', {
              description: 'Incorrect username or password',
            });
          } else {
            toast.error('Error', {
              description: result.error,
            });
          }
        }

    if(result?.url){
      router.replace('/dashboard')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">Sign in to start your anonymous adventure</p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          <Controller
            name="identifier"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel>Email/Username</FieldLabel>
                <Input className="border-2 rounded-md p-2" placeholder="email/username" {...field}/>
              </Field>
            )}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input className="border-2 rounded-md p-2" type="password" placeholder="password" {...field}/>
              </Field>
            )}
          />
          <Button type="submit"> Signin </Button>
        </form>
        <div className="text-center mt-4">
          <p>
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page 
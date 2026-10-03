'use client'

import { verifySchema } from '@/src/schemas/verifySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import React from 'react'
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod'
import { toast } from "sonner";
import axios, { AxiosError } from 'axios';
import { usernameValidation } from '@/src/schemas/signUpSchema';
import { PARAM_SEPARATOR } from 'next/dist/lib/route-pattern-normalizer';
import { ApiResponse } from '@/src/types/ApiResponse';
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';

function VerifyAccount() {
    const router = useRouter()
    const params = useParams<{username: string}>()

      //zod implementation
    const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
        defaultValues: {
            code: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try{
            const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code
            })

            toast.success("Success", {
                description: response.data.message
            })

            router.push('/sign-in')
            
        }  catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;

            console.error(
                "VERIFY ERROR:",
                axiosError.response?.data
            );

            toast.error("Verification failed", {
                description:
                    axiosError.response?.data?.message ||
                    "Error verifying user",
            });
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                
                <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                    Verify Your Account
                </h1>

                <p className="mb-4">
                    Enter the verification code sent to your email
                </p>
                </div>

                <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
                >
                <Controller
                    name="code"
                    control={form.control}
                    render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                        Verification Code
                        </FieldLabel>

                        <Input
                        {...field}
                        id={field.name}
                        className="border-2 rounded-md p-1"
                        placeholder="Enter verification code"
                        aria-invalid={fieldState.invalid}
                        />

                        {fieldState.invalid && (
                        <p className="text-sm text-red-500">
                            {fieldState.error?.message}
                        </p>
                        )}
                    </Field>
                    )}      
                />

                <Button type="submit">Verify</Button>
                </form>

            </div>
        </div>
    )
}

export default VerifyAccount
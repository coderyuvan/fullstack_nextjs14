"use client";
import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/model/User';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';

const page = () => {

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { toast } = useToast();

  const handleDeleteMessage=(messageId:string)=>{
    // ui updated on clicikng delte not backend optimise ui approach
    setMessages(messages.filter((message)=>message._id!==messageId))
  }

  const {data:session}=useSession()
  const form=useForm({
    resolver:zodResolver(AcceptMessageSchema)
  })
  const {register,watch,setValue}=form
  // " " k ander jo bhi h usko likhna pdega in ui watch method m
  const acceptMessages = watch('acceptMessages');


  const fetchAcceptMessage=useCallback(async ()=>{
  setIsSwitchLoading(true)
  try {
  const response=  await axios.get('/api/accept-messages')
  setValue('acceptMessages',response.data.isAcceptingMessages)
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    toast({
      title: 'Error',
      description:
        axiosError.response?.data.message ??
        'Failed to fetch message settings',
      variant: 'destructive',
    });
  } finally {
    setIsSwitchLoading(false);
  }
  },[setValue,toast])

  const fetchMessages=useCallback(async (refresh:boolean=false)=>{
    setIsLoading(true)
    setIsSwitchLoading(true);
    try {
      const response=await axios.get<ApiResponse>('/api/get-messages')
      setMessages(response.data.messages || [])
      if (refresh) {
        toast({
          title: 'Refreshed Messages',
          description: 'Showing latest messages',
        });
      }

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
       toast({
        title: 'Error',
        description:
          axiosError.response?.data.message??
          'Failed to fetch messages',
        variant: 'destructive',
      });
    }
    finally {
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  },[setIsLoading,setMessages])

  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();

    fetchAcceptMessage();
  }, [session, setValue, toast, fetchAcceptMessage, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast({
        title: response.data.message,
        variant: 'default',
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to update message settings',
        variant: 'destructive',
      });
    }
  };

  const username = session?.user?.username; 
  const baseUrl=`${window.location.protocol}//${window.location.host}`
  const profileUrl=username ?`${baseUrl}/u/${username}`:''

  const copyToClipboard=()=>{
   navigator.clipboard.writeText(profileUrl);
   toast({
    title: 'URL Copied!',
    description: 'Profile URL has been copied to clipboard.',
  });
  }

  if (!session || !session.user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex items-center space-x-4 animate-fadeIn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856C18.478 20.64 21 17.514 21 13.75S18.478 6.86 13.924 6.56M8.634 4.213c-.87.725-1.796 1.406-2.84 1.977C4.29 7.09 3 8.85 3 10.583v5.25C3 18.2 5.5 21 9 21h.136m6.973-1.635A5.998 5.998 0 0015 12"
            />
          </svg>
          <span className="text-lg font-semibold text-gray-700">Please Login</span>
        </div>
      </div>
    );
  }

  
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default page;

 'use client'
 import React from 'react'
 import { Card, CardContent } from "@/components/ui/card"
 import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react'; // Assuming you have an icon for messages
import {  CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';
 import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

 const Home = () => {
   return (
    <>
     <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-800 text-white">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            True Feedback - Where your identity remains a secret.
          </p>
        </section>
        <Carousel
        plugins={[Autoplay({ delay: 2000 })]} 
        className="w-full max-w-xs">
      <CarouselContent>
         {
          messages.map((message,index)=>(
            <CarouselItem key={index} className="p-6">
            <div
              className="w-full max-w-lg mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold truncate">{message.title}</h3>
              </div>
        
              <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
                <Mail className="h-8 w-8 text-white opacity-80" />
                <div>
                  <p className="text-lg font-medium">{message.content}</p>
                  <p className="mt-3 text-sm text-gray-300">{message.received}</p>
                </div>
              </div>
            </div>
          </CarouselItem>
          ))
         }
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
        </main>
    </>
      
   )
 }
 
 export default Home
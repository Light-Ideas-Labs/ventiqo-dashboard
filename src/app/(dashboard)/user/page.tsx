"use client"; // This ensures the component is treated as a client component

import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { Search, Calendar, Mail, Star, Settings, MapPin, Music, Camera, Share2, Heart, ArrowRight, } from "lucide-react";
import mapboxgl from "mapbox-gl"; // Import Mapbox GL
import PageContainer from "@/components/layouts/page-container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardFooter, CardTitle, CardContent, } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, } from "@/components/ui/dialog"; // Assuming you have dialog component
import { Layout } from "@/components/layouts/profile-layout/layout";
import Header from "@/components/layouts/profile-layout/Header";
import Body from "@/components/layouts/profile-layout/Body";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventDetailsPopup from "@/components/forms/event-forms/event-details-popup"; // Import the EventDetailsPopup component

import EventsUserViewForm from "@/components/forms/event-forms/events-user-view-form";
import ExploreEventsMap from "@/components/map/ExploreEventsMap";

const User = () => {
  const { data: session } = useSession();

  return (
    <PageContainer scrollable={true} bgColor="bg-blue-200">
      <Link
        href="/on-boarding"
        className="mb-4 flex items-center justify-between rounded-xl bg-wizard-accent px-5 py-4 text-wizard-accent-foreground shadow-sm transition-opacity hover:opacity-90"
      >
        <div>
          <p className="font-semibold">Become an Organizer</p>
          <p className="text-sm opacity-90">Set up your organizer profile and start selling tickets.</p>
        </div>
        <ArrowRight className="size-5 shrink-0" />
      </Link>
      <ExploreEventsMap />
    </PageContainer>
  );
};

export default User;

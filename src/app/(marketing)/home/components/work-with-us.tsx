"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/cta-button";

const WorkWithUs: React.FC = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent", {
      description: "Thanks for reaching out — we'll get back to you soon.",
    });
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact-us" className="bg-[#EAF6F6] py-16">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="rounded-3xl bg-[#2C7873] p-8 text-white md:p-12">
          <h2 className="mb-2 text-center text-3xl font-bold">
            Work with Us
          </h2>
          <p className="mb-8 text-center text-white/80">
            If you would like to work with us, input your details below and we
            will get back to you.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              placeholder="Name:"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border-none bg-white text-gray-900 placeholder:text-gray-500"
              required
            />
            <Input
              type="email"
              placeholder="Email:"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="border-none bg-white text-gray-900 placeholder:text-gray-500"
              required
            />
            <Textarea
              placeholder="Write us a Message:"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="min-h-32 border-none bg-white text-gray-900 placeholder:text-gray-500"
              required
            />
            <Button
              type="submit"
              className="mt-2 w-full bg-[#F5A623] text-white hover:bg-[#F5A623]/90"
              size="lg"
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default WorkWithUs;

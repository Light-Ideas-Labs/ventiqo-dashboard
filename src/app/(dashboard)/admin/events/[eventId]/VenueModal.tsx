"use client";

import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import CustomModal from "@/components/modals/CustomModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { closeVenueModal } from "@/state/eventEditorReducer"; // For VenueModal
import { RootState } from "@/state/store";

import { X } from "lucide-react";

// 🏢 Venue Schema Validation using Zod
const venueSchema = z.object({
  venueName: z.string().nonempty("Venue name is required"),
  address: z.string().nonempty("Address is required"),
  city: z.string().nonempty("City is required"),
  country: z.string().nonempty("Country is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
});

type VenueFormData = z.infer<typeof venueSchema>;

const VenueModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.eventEditor.isVenueModalOpen);

  const methods = useForm<VenueFormData>({
    resolver: zodResolver(venueSchema),
    defaultValues: {
      venueName: "",
      address: "",
      city: "",
      country: "",
      capacity: 0,
    },
  });

  const onClose = () => {
    dispatch(closeVenueModal());
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <div className="venue-modal p-6 bg-white rounded-lg shadow-lg w-full max-w-lg">
        {/* Modal Header */}
        <div className="venue-modal__header">
          <h2 className="venue-modal__title">Add Venue</h2>
          <button onClick={onClose} className="venue-modal__close">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Venue Form */}
        <Form {...methods}>
          <form className="venue-modal__form">
            {/* Venue Name */}
            <FormField
              control={methods.control}
              name="venueName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="venue-modal__input">Venue Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Enter venue name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={methods.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="venue-modal__input">Address</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Enter address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* City */}
            <FormField
              control={methods.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="venue-modal__input">City</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Enter city" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Country */}
            <FormField
              control={methods.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="venue-modal__input">Country</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Enter country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Capacity */}
            <FormField
              control={methods.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="venue-modal__input">Capacity</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter capacity" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Modal Actions */}
            <div className="venue-modal__actions">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary-700 hover:bg-primary-600">
                Save Venue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </CustomModal>
  );
};

export default VenueModal;

"use client";

import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { closeVenueModal } from "@/state/eventEditorReducer";
import { RootState } from "@/state/store";
import { useUpdateEvent } from "@/state/eventsAPI";

const venueSchema = z.object({
  venueName: z.string().nonempty("Venue name is required"),
  address: z.string().nonempty("Address is required"),
  city: z.string().nonempty("City is required"),
  country: z.string().nonempty("Country is required"),
});

type VenueFormData = z.infer<typeof venueSchema>;

const VenueModal = ({ eventId }: { eventId: string }) => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.eventEditor.isVenueModalOpen);
  const updateEvent = useUpdateEvent();

  const methods = useForm<VenueFormData>({
    resolver: zodResolver(venueSchema),
    defaultValues: {
      venueName: "",
      address: "",
      city: "",
      country: "",
    },
  });

  const onClose = () => {
    methods.reset();
    dispatch(closeVenueModal());
  };

  // The event model only persists a single venueName string - there's no
  // structured address/city/country on the backend yet, so this composes
  // the four fields into one readable string rather than silently dropping
  // the extra detail the user typed.
  const onSubmit = async (data: VenueFormData) => {
    if (!eventId) {
      toast.error("Save the event before adding a venue");
      return;
    }
    const venueName = `${data.venueName}, ${data.address}, ${data.city}, ${data.country}`;
    try {
      await updateEvent.mutateAsync({ eventId, eventDetails: { venueName } });
      toast.success("Venue saved");
      onClose();
    } catch (error) {
      console.error("Failed to save venue:", error);
      toast.error("Failed to save venue");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Add Venue</SheetTitle>
          <SheetDescription>Where is this event taking place?</SheetDescription>
        </SheetHeader>

        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-6 px-4">
            <FormField
              control={methods.control}
              name="venueName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Venue Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Enter venue name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Enter address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={methods.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <SheetFooter className="flex-row justify-end gap-2 px-0">
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </SheetClose>
              <Button type="submit" disabled={updateEvent.isPending}>
                {updateEvent.isPending ? "Saving…" : "Save Venue"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default VenueModal;

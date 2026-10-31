"use client";

import { useState } from "react";
import {
    AlignLeftIcon,
    CircleDollarSignIcon,
    ImageIcon,
    InfoIcon,
    LockIcon,
    SparklesIcon,
    UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/toast";

const CATEGORIES = [
    "Photo Studio",
    "Film Stage",
    "Podcast Lounge",
    "Music Suite",
    "Workshop",
    "Dance Studio",
    "Art Studio",
    "Rehearsal Room",
    "Maker Space / Co-working",
    "Event Space",
] as const;

const AMENITIES = [
    "High-speed Wi-Fi",
    "Natural Lighting",
    "Blackout Curtains",
    "Cyclorama Wall",
    "Green Screen",
    "Soundproofing",
    "Editing Suite",
    "Gear Rental",
    "Changing Room",
    "Kitchenette",
    "Free Parking",
    "Wheelchair Accessible",
] as const;

/** Hide number-input spinners for a cleaner look. */
const numberInputClass =
    "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

/** Label + control + optional hint, in a single column. */
function Field({
    label,
    htmlFor,
    hint,
    className,
    children,
}: {
    label: string;
    htmlFor: string;
    hint?: string;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <Label htmlFor={htmlFor}>{label}</Label>
            {children}
            {hint ? (
                <p className="text-xs text-muted-foreground">{hint}</p>
            ) : null}
        </div>
    );
}

/** Card with an icon chip, title, and description — groups related fields. */
function SectionCard({
    icon: Icon,
    title,
    description,
    children,
}: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    children: React.ReactNode;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2.5">
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-sm shadow-purple-500/25">
                        <Icon className="size-4" aria-hidden="true" />
                    </span>
                    {title}
                </CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}

export default function AddNewStudioPage() {
    const { user } = useAuth();
    const [category, setCategory] = useState<string>("");
    const [amenities, setAmenities] = useState<string[]>([]);

    const toggleAmenity = (amenity: string, checked: boolean) => {
        setAmenities((prev) =>
            checked
                ? [...prev, amenity]
                : prev.filter((item) => item !== amenity)
        );
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;

        const formData = new FormData(form);
        const studios = Object.fromEntries(formData.entries());

        console.log(studios, "studios");

        const result = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/studios`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(studios)
        });
        const data = await result.json();
        console.log(data, "data");

        if (data.acknowledged) {
            toast.add({
                title: "Event created",
                description: "Your event has been created successfully.",
                type: "success",
            });
        } else {
            toast.add({
                title: "Error",
                description: "There was an error creating your event.",
                type: "error",
            })
        }


        // const studioData = {
        //     title:String(formData.get("title")).trim(),
        //     category:String(formData.get("category")),
        //     location:String(formData.get("location")),
        //     hourlyRate:Number(formData.get("hourlyRate")),
        //     securityDeposit:Number(formData.get("securityDeposit")),
        //     maxCapacity:Number(formData.get("maxCapacity")),
        //     imageUrl:String(formData.get("imageUrl")),
        //     amenities,
        //     overview:String(formData.get("overview")),
        //     ownerName:user?.name ?? "",
        //     ownerEmail:user?.email ?? "",
        // };

    }


    return (
        <div className="mx-auto w-full max-w-4xl px-1 py-2 sm:px-2">
            {/* Title — top left */}
            <header className="mb-6">
                <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 via-violet-500 to-purple-600 bg-clip-text text-transparent sm:text-4xl">
                    Add New Studio
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                    Fill in the details below to list your space on StudioSpace.
                </p>
            </header>

            <form
                className="flex flex-col gap-6"
                onSubmit={handleSubmit}
            >
                {/* 1. Basic details */}
                <SectionCard
                    icon={SparklesIcon}
                    title="Studio Details"
                    description="The name, category, and location of your studio."
                >
                    <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2">
                        <Field
                            label="Title"
                            htmlFor="title"
                            className="md:col-span-2"
                            hint="The studio name shown to guests."
                        >
                            <Input
                                id="title"
                                name="title"
                                type="text"
                                placeholder="e.g. Loft Photo Studio — Downtown"
                                className="h-10"
                            />
                        </Field>

                        <Field label="Category" htmlFor="category">

                            <Select value={category} onValueChange={(value) => setCategory(String(value ?? ""))}>
                                <SelectTrigger id="category" className="h-10 w-full">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map((option) => (
                                        <SelectItem key={option} value={option}>
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <input
                                type="hidden"
                                name="category"
                                value={category}
                            />
                        </Field>

                        <Field
                            label="Location / Address"
                            htmlFor="location"
                            hint="Full address or neighborhood."
                        >
                            <Input
                                id="location"
                                name="location"
                                type="text"
                                placeholder="e.g. 123 Studio Ave, Brooklyn, NY"
                                className="h-10"
                            />
                        </Field>
                    </div>
                </SectionCard>

                {/* 2. Pricing & capacity */}
                <SectionCard
                    icon={CircleDollarSignIcon}
                    title="Pricing & Capacity"
                    description="What guests pay and how many people your studio fits."
                >
                    <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-3">
                        <Field label="Hourly Rate ($)" htmlFor="hourly-rate">
                            <div className="relative">
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground"
                                >
                                    $
                                </span>
                                <Input
                                    id="hourly-rate"
                                    name="hourlyRate"
                                    type="number"
                                    min={0}
                                    step="1"
                                    placeholder="45"
                                    className={cn("h-10 pl-7", numberInputClass)}
                                />
                            </div>
                        </Field>
                    

                        <Field label="Security Deposit ($)" htmlFor="security-deposit">
                            <div className="relative">
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground"
                                >
                                    $
                                </span>
                                <Input
                                    id="security-deposit"
                                    name="securityDeposit"
                                    type="number"
                                    min={0}
                                    step="1"
                                    placeholder="200"
                                    className={cn("h-10 pl-7", numberInputClass)}
                                />
                            </div>
                        </Field>

                        <Field label="Max Capacity" htmlFor="max-capacity">
                            <div className="relative">
                                <Input
                                    id="max-capacity"
                                    name="maxCapacity"
                                    type="number"
                                    min={1}
                                    step="1"
                                    placeholder="12"
                                    className={cn("h-10 pr-16", numberInputClass)}
                                />
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground"
                                >
                                    people
                                </span>
                            </div>
                        </Field>
                            <Field label="Rating (out of 5)" htmlFor="rating">
                            <Input
                                id="rating"
                                name="rating"
                                type="number"
                                min={0}
                                max={5}
                                step="0.1"
                                placeholder="4.5"
                                className="h-10"
                            />
                        </Field>
                    </div>
                </SectionCard>

                {/* 3. Image & amenities */}
                <SectionCard
                    icon={ImageIcon}
                    title="Photos & Amenities"
                    description="A cover image and everything your studio offers."
                >
                    <div className="flex flex-col gap-5">
                        <Field
                            label="Image URL"
                            htmlFor="image-url"
                            hint="Direct link to a cover photo of your studio."
                        >
                            <Input
                                id="image-url"
                                name="imageUrl"
                                type="url"
                                placeholder="https://example.com/studio.jpg"
                                className="h-10"
                            />
                        </Field>

                        <fieldset className="flex flex-col gap-3">
                            <legend className="text-sm leading-none font-medium">
                                Amenities
                            </legend>
                            <p className="text-xs text-muted-foreground">
                                Select all that apply — guests love detailed amenity lists.
                            </p>
                            <div className="flex flex-wrap gap-2.5">
                                {AMENITIES.map((amenity) => {
                                    const isSelected = amenities.includes(amenity);

                                    return (
                                        <label
                                            key={amenity}
                                            className={cn(
                                                "flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-all select-none",
                                                isSelected
                                                    ? "border-transparent bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md shadow-purple-500/25"
                                                    : "border-border bg-background text-muted-foreground hover:border-transparent hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white"
                                            )}
                                        >
                                            <Checkbox
                                                checked={isSelected}
                                                onCheckedChange={(checked) =>
                                                    toggleAmenity(amenity, checked === true)
                                                }
                                                className={cn(
                                                    isSelected &&
                                                    "border-white/50 bg-white/20 text-purple-700 data-checked:border-white data-checked:bg-white data-checked:text-purple-700"
                                                )}
                                            />
                                            {amenity}
                                        </label>
                                    );
                                })}
                            </div>
                        </fieldset>
                    </div>
                </SectionCard>

                {/* 4. Overview */}
                <SectionCard
                    icon={AlignLeftIcon}
                    title="Detailed Overview"
                    description="Describe the space, its vibe, and what makes it special."
                >
                    <Field
                        label="Detailed Overview"
                        htmlFor="overview"
                        hint="Aim for at least 3–4 sentences. Mention lighting, layout, and ideal use cases."
                    >
                        <Textarea
                            id="overview"
                            name="overview"
                            rows={6}
                            placeholder="Our sunlit loft studio features 14-foot ceilings, a cyclorama wall, and a private changing area…"
                        />
                    </Field>
                </SectionCard>

                {/* 5. Owner (read-only) */}
                <SectionCard
                    icon={UserIcon}
                    title="Studio Owner"
                    description="Taken from your signed-in account — these fields are read-only."
                >
                    <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2">
                        <Field label="User Name" htmlFor="user-name">
                            <Input
                                id="user-name"
                                name="userName"
                                type="text"
                                readOnly
                                value={user?.name ?? ""}
                                placeholder="Not signed in"
                                className="h-10 cursor-default bg-muted/50 font-medium"
                            />
                        </Field>

                        <Field label="User Email" htmlFor="user-email">
                            <Input
                                id="user-email"
                                name="userEmail"
                                type="email"
                                readOnly
                                value={user?.email ?? ""}
                                placeholder="Not signed in"
                                className="h-10 cursor-default bg-muted/50 font-medium"
                            />
                        </Field>
                    </div>

                    <p className="mt-4 flex items-center gap-2 rounded-lg border border-border/60 bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground">
                        <LockIcon className="size-3.5 shrink-0" aria-hidden="true" />
                        Owner details are linked to your account automatically when you save
                        the listing.
                    </p>
                </SectionCard>

                {/* Submit */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground sm:mr-auto">
                        <InfoIcon className="size-3.5 shrink-0" aria-hidden="true" />
                        All fields marked with a label are required to publish a listing.
                    </p>
                    <Button
                        type="submit"
                        className="
  relative inline-flex min-h-11 w-full items-center justify-center
  rounded-lg px-6 py-2.5 text-center text-base font-semibold text-white
  bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-500
  shadow-lg shadow-indigo-500/25
  transition-all duration-200
  hover:-translate-y-0.5 hover:brightness-110 hover:shadow-xl hover:shadow-indigo-500/30
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2
  active:translate-y-0 active:brightness-95
  disabled:pointer-events-none disabled:opacity-50
  sm:w-auto sm:px-8
"
                    >
                        Add Studio
                    </Button>
                </div>
            </form>
        </div>
    );
}

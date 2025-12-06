"use client";
import React, { useState } from "react";
import Logo from "@/components/brand/Logo";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Radio } from "@/components/ui/Radio";
import { Switch } from "@/components/ui/Switch";
import { Modal, ModalContent, ModalFooter } from "@/components/ui/Modal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Spinner } from "@/components/ui/Spinner";
import { Avatar } from "@/components/ui/Avatar";
import { Textarea } from "@/components/ui/Textarea";
import { Tooltip } from "@/components/ui/Tooltip";
import { Separator } from "@/components/ui/Separator";
import SectionSkeleton from "@/components/ui/SectionSkeleton";
import GlowOrb from "@/components/ui/GlowOrb";
import VoicePulseIndicator from "@/components/ui/VoicePulseIndicator";
import GradientText from "@/components/ui/GradientText";
import { Sparkles, Brain, Zap, Bot, MessageSquare } from "lucide-react";

export default function DesignSystemShowcase() {
  const [modalOpen, setModalOpen] = useState(false);
  const [radioValue, setRadioValue] = useState("option1");

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden text-slate-900 selection:bg-[#005bbc]/20 selection:text-[#005bbc]">
      <main className="relative">
        {/* Header */}
        <header className="py-8 border-b-2 border-slate-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-4xl font-bold text-slate-900">Complete Design System</h1>
              <p className="text-lg text-slate-600 mt-2">All components, colors, typography, and design tokens</p>
            </div>
          </div>
        </header>

        {/* Logo Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Logo Variations</h2>
              <p className="text-lg text-slate-600 mb-8">Logo in different sizes and backgrounds</p>
              
              {/* Logo Sizes */}
              <div className="mb-12">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Logo Sizes</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white rounded-2xl border-2 border-slate-200 p-8 text-center">
                    <Logo size="sm" className="mx-auto mb-4" />
                    <p className="text-sm font-semibold text-slate-900 mb-1">Small (sm)</p>
                    <p className="text-xs text-slate-500">w-12 h-12</p>
                  </div>
                  <div className="bg-white rounded-2xl border-2 border-slate-200 p-8 text-center">
                    <Logo size="md" className="mx-auto mb-4" />
                    <p className="text-sm font-semibold text-slate-900 mb-1">Medium (md)</p>
                    <p className="text-xs text-slate-500">w-16 h-16</p>
                  </div>
                  <div className="bg-white rounded-2xl border-2 border-slate-200 p-8 text-center">
                    <Logo size="lg" className="mx-auto mb-4" />
                    <p className="text-sm font-semibold text-slate-900 mb-1">Large (lg)</p>
                    <p className="text-xs text-slate-500">w-24 h-24</p>
                  </div>
                </div>
              </div>

              {/* Logo on Dark Backgrounds */}
              <div className="mb-12">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Logo on Dark Backgrounds</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-slate-900 rounded-2xl border-2 border-slate-800 p-8 text-center">
                    <Logo size="md" className="mx-auto mb-4" />
                    <p className="text-sm font-semibold text-white mb-1">Slate 900</p>
                    <p className="text-xs text-slate-400">#0F172A</p>
                  </div>
                  <div className="bg-slate-800 rounded-2xl border-2 border-slate-700 p-8 text-center">
                    <Logo size="md" className="mx-auto mb-4" />
                    <p className="text-sm font-semibold text-white mb-1">Slate 800</p>
                    <p className="text-xs text-slate-400">#1E293B</p>
                  </div>
                  <div className="bg-[#005bbc] rounded-2xl border-2 border-[#004a9f] p-8 text-center">
                    <Logo size="md" className="mx-auto mb-4" />
                    <p className="text-sm font-semibold text-white mb-1">Primary Blue</p>
                    <p className="text-xs text-blue-200">#005bbc</p>
                  </div>
                  <div className="bg-[#004a9f] rounded-2xl border-2 border-[#005bbc] p-8 text-center">
                    <Logo size="md" className="mx-auto mb-4" />
                    <p className="text-sm font-semibold text-white mb-1">Primary Dark</p>
                    <p className="text-xs text-blue-200">#004a9f</p>
                  </div>
                </div>
              </div>

              {/* Logo on Light Backgrounds */}
              <div className="mb-12">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Logo on Light Backgrounds</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-2xl border-2 border-slate-200 p-8 text-center">
                    <Logo size="md" className="mx-auto mb-4" />
                    <p className="text-sm font-semibold text-slate-900 mb-1">White</p>
                    <p className="text-xs text-slate-600">#FFFFFF</p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl border-2 border-slate-200 p-8 text-center">
                    <Logo size="md" className="mx-auto mb-4" />
                    <p className="text-sm font-semibold text-slate-900 mb-1">Slate 50</p>
                    <p className="text-xs text-slate-600">#F8FAFC</p>
                  </div>
                  <div className="bg-[#005bbc]/10 rounded-2xl border-2 border-[#005bbc]/20 p-8 text-center">
                    <Logo size="md" className="mx-auto mb-4" />
                    <p className="text-sm font-semibold text-slate-900 mb-1">Primary Light</p>
                    <p className="text-xs text-slate-600">rgba(0, 91, 188, 0.10)</p>
                  </div>
                  <div className="bg-[#ffd600]/10 rounded-2xl border-2 border-[#ffd600]/20 p-8 text-center">
                    <Logo size="md" className="mx-auto mb-4" />
                    <p className="text-sm font-semibold text-slate-900 mb-1">Accent Light</p>
                    <p className="text-xs text-slate-600">rgba(255, 214, 0, 0.10)</p>
                  </div>
                </div>
              </div>

              {/* Logo on Colored Backgrounds */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-6">Logo on Colored Backgrounds</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-[#ffd600] rounded-2xl border-2 border-[#ffd600] p-8 text-center">
                    <Logo size="md" className="mx-auto mb-4" />
                    <p className="text-sm font-semibold text-slate-900 mb-1">Accent Yellow</p>
                    <p className="text-xs text-slate-700">#ffd600</p>
                  </div>
                  <div className="bg-[#10B981] rounded-2xl border-2 border-[#10B981] p-8 text-center">
                    <Logo size="md" className="mx-auto mb-4" />
                    <p className="text-sm font-semibold text-white mb-1">Success</p>
                    <p className="text-xs text-green-200">#10B981</p>
                  </div>
                  <div className="bg-[#F59E0B] rounded-2xl border-2 border-[#F59E0B] p-8 text-center">
                    <Logo size="md" className="mx-auto mb-4" />
                    <p className="text-sm font-semibold text-white mb-1">Warning</p>
                    <p className="text-xs text-amber-200">#F59E0B</p>
                  </div>
                  <div className="bg-[#EF4444] rounded-2xl border-2 border-[#EF4444] p-8 text-center">
                    <Logo size="md" className="mx-auto mb-4" />
                    <p className="text-sm font-semibold text-white mb-1">Error</p>
                    <p className="text-xs text-red-200">#EF4444</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Primary Colors */}
        <section className="py-20 bg-slate-50 border-y-2 border-slate-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Primary Colors</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
                  <div className="w-full h-24 bg-[#005bbc] rounded-xl mb-4 border-2 border-[#005bbc]"></div>
                  <p className="text-sm font-bold text-slate-900 mb-1">Primary Blue</p>
                  <p className="text-xs text-slate-600 font-mono">#005bbc</p>
                </div>
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
                  <div className="w-full h-24 bg-[#004a9f] rounded-xl mb-4 border-2 border-[#004a9f]"></div>
                  <p className="text-sm font-bold text-slate-900 mb-1">Primary Dark</p>
                  <p className="text-xs text-slate-600 font-mono">#004a9f</p>
                </div>
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
                  <div className="w-full h-24 bg-[#005bbc]/10 rounded-xl mb-4 border-2 border-[#005bbc]/20"></div>
                  <p className="text-sm font-bold text-slate-900 mb-1">Primary Light</p>
                  <p className="text-xs text-slate-600 font-mono">rgba(0, 91, 188, 0.10)</p>
                </div>
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
                  <div className="w-full h-24 bg-white rounded-xl mb-4 border-2 border-[#005bbc]/20"></div>
                  <p className="text-sm font-bold text-slate-900 mb-1">Primary Border</p>
                  <p className="text-xs text-slate-600 font-mono">rgba(0, 91, 188, 0.20)</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Accent Colors */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Accent Colors</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
                  <div className="w-full h-24 bg-[#ffd600] rounded-xl mb-4 border-2 border-[#ffd600]"></div>
                  <p className="text-sm font-bold text-slate-900 mb-1">Accent Yellow</p>
                  <p className="text-xs text-slate-600 font-mono">#ffd600</p>
                </div>
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
                  <div className="w-full h-24 bg-[#ffd600]/10 rounded-xl mb-4 border-2 border-[#ffd600]/20"></div>
                  <p className="text-sm font-bold text-slate-900 mb-1">Accent Light</p>
                  <p className="text-xs text-slate-600 font-mono">rgba(255, 214, 0, 0.10)</p>
                </div>
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
                  <div className="w-full h-24 bg-white rounded-xl mb-4 border-2 border-[#ffd600]/20"></div>
                  <p className="text-sm font-bold text-slate-900 mb-1">Accent Border</p>
                  <p className="text-xs text-slate-600 font-mono">rgba(255, 214, 0, 0.20)</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Status Colors */}
        <section className="py-20 bg-slate-50 border-y-2 border-slate-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Status Colors</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
                  <div className="w-full h-24 bg-[#10B981] rounded-xl mb-4 border-2 border-[#10B981]"></div>
                  <p className="text-sm font-bold text-slate-900 mb-1">Success</p>
                  <p className="text-xs text-slate-600 font-mono">#10B981</p>
                </div>
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
                  <div className="w-full h-24 bg-[#F59E0B] rounded-xl mb-4 border-2 border-[#F59E0B]"></div>
                  <p className="text-sm font-bold text-slate-900 mb-1">Warning</p>
                  <p className="text-xs text-slate-600 font-mono">#F59E0B</p>
                </div>
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
                  <div className="w-full h-24 bg-[#EF4444] rounded-xl mb-4 border-2 border-[#EF4444]"></div>
                  <p className="text-sm font-bold text-slate-900 mb-1">Error</p>
                  <p className="text-xs text-slate-600 font-mono">#EF4444</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Neutral Colors */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Neutral Colors (Slate)</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
                  <div className="w-full h-24 bg-slate-900 rounded-xl mb-4 border-2 border-slate-900"></div>
                  <p className="text-sm font-bold text-slate-900 mb-1">Slate 900</p>
                  <p className="text-xs text-slate-600 font-mono">#0F172A</p>
                </div>
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
                  <div className="w-full h-24 bg-slate-800 rounded-xl mb-4 border-2 border-slate-800"></div>
                  <p className="text-sm font-bold text-slate-900 mb-1">Slate 800</p>
                  <p className="text-xs text-slate-600 font-mono">#1E293B</p>
                </div>
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
                  <div className="w-full h-24 bg-slate-600 rounded-xl mb-4 border-2 border-slate-600"></div>
                  <p className="text-sm font-bold text-slate-900 mb-1">Slate 600</p>
                  <p className="text-xs text-slate-600 font-mono">#475569</p>
                </div>
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
                  <div className="w-full h-24 bg-slate-200 rounded-xl mb-4 border-2 border-slate-200"></div>
                  <p className="text-sm font-bold text-slate-900 mb-1">Slate 200</p>
                  <p className="text-xs text-slate-600 font-mono">#E2E8F0</p>
                </div>
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
                  <div className="w-full h-24 bg-slate-50 rounded-xl mb-4 border-2 border-slate-200"></div>
                  <p className="text-sm font-bold text-slate-900 mb-1">Slate 50</p>
                  <p className="text-xs text-slate-600 font-mono">#F8FAFC</p>
                </div>
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
                  <div className="w-full h-24 bg-white rounded-xl mb-4 border-2 border-slate-200"></div>
                  <p className="text-sm font-bold text-slate-900 mb-1">White</p>
                  <p className="text-xs text-slate-600 font-mono">#FFFFFF</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="py-20 bg-slate-50 border-y-2 border-slate-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Typography</h2>
              <div className="space-y-8">
                <div>
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-2">Heading 1</h1>
                  <p className="text-sm text-slate-500 font-mono">text-5xl sm:text-6xl lg:text-7xl font-bold</p>
                </div>
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-2">Heading 2</h2>
                  <p className="text-sm text-slate-500 font-mono">text-3xl sm:text-4xl font-bold</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Heading 3</h3>
                  <p className="text-sm text-slate-500 font-mono">text-2xl font-bold</p>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Heading 4</h4>
                  <p className="text-sm text-slate-500 font-mono">text-xl font-bold</p>
                </div>
                <div>
                  <p className="text-lg text-slate-600 leading-relaxed mb-2">Large body text - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  <p className="text-sm text-slate-500 font-mono">text-lg text-slate-600 leading-relaxed</p>
                </div>
                <div>
                  <p className="text-base text-slate-600 leading-relaxed mb-2">Base body text - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  <p className="text-sm text-slate-500 font-mono">text-base text-slate-600 leading-relaxed</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-2">Small text - Lorem ipsum dolor sit amet</p>
                  <p className="text-sm text-slate-500 font-mono">text-sm text-slate-500</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Buttons</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Button Variants</h3>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="primary">Primary Button</Button>
                    <Button variant="secondary">Secondary Button</Button>
                    <Button variant="outline">Outline Button</Button>
                    <Button variant="ghost">Ghost Button</Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Button Sizes</h3>
                  <div className="flex flex-wrap items-center gap-4">
                    <Button variant="primary" size="sm">Small</Button>
                    <Button variant="primary" size="md">Medium</Button>
                    <Button variant="primary" size="lg">Large</Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Button with Glow</h3>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="primary" glow>Primary with Glow</Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Disabled Buttons</h3>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="primary" disabled>Disabled Primary</Button>
                    <Button variant="outline" disabled>Disabled Outline</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section className="py-20 bg-slate-50 border-y-2 border-slate-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Cards</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Default Card</h3>
                    <p className="text-slate-600">Standard card with border-2 border-slate-200</p>
                  </div>
                </Card>
                
                <Card variant="primary">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Primary Card</h3>
                    <p className="text-slate-600">Card with primary blue background tint</p>
                  </div>
                </Card>
                
                <Card variant="accent">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Accent Card</h3>
                    <p className="text-slate-600">Card with accent yellow background tint</p>
                  </div>
                </Card>
                
                <Card variant="gradient">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Gradient Card</h3>
                    <p className="text-slate-600">Card with gradient background</p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Form Inputs */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Form Inputs</h2>
              
              <div className="max-w-md space-y-6">
                <Input 
                  label="Default Input"
                  placeholder="Enter text here"
                />
                
                <Input 
                  label="Input with Glow"
                  placeholder="Enter text here"
                  glow
                />
                
                <Input 
                  label="Input with Error"
                  placeholder="Enter text here"
                  error="This field is required"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Badges */}
        <section className="py-20 bg-slate-50 border-y-2 border-slate-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Badges</h2>
              
              <div className="flex flex-wrap gap-4">
                <Badge variant="default">Default Badge</Badge>
                <Badge variant="secondary">Secondary Badge</Badge>
                <Badge variant="outline">Outline Badge</Badge>
                <Badge variant="success">Success Badge</Badge>
                <Badge variant="warning">Warning Badge</Badge>
                <Badge variant="destructive">Destructive Badge</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Alerts */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Alerts</h2>
              
              <div className="space-y-4 max-w-2xl">
                <Alert variant="default" title="Default Alert">
                  This is a default alert message.
                </Alert>
                <Alert variant="success" title="Success Alert">
                  Operation completed successfully!
                </Alert>
                <Alert variant="warning" title="Warning Alert">
                  Please review this information carefully.
                </Alert>
                <Alert variant="error" title="Error Alert">
                  Something went wrong. Please try again.
                </Alert>
                <Alert variant="info" title="Info Alert">
                  Here&apos;s some helpful information for you.
                </Alert>
              </div>
            </div>
          </div>
        </section>

        {/* Select Dropdown */}
        <section className="py-20 bg-slate-50 border-y-2 border-slate-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Select Dropdown</h2>
              
              <div className="max-w-md space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Default Select</label>
                  <Select
                    options={[
                      { value: "option1", label: "Option 1" },
                      { value: "option2", label: "Option 2" },
                      { value: "option3", label: "Option 3" }
                    ]}
                  >
                    <option value="">Select an option</option>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Select with Error</label>
                  <Select
                    error
                    options={[
                      { value: "option1", label: "Option 1" },
                      { value: "option2", label: "Option 2" }
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Checkbox & Radio */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Checkbox & Radio</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Checkboxes</h3>
                  <div className="space-y-4">
                    <Checkbox 
                      label="Unchecked checkbox"
                      checked={false}
                      onChange={() => {}}
                    />
                    <Checkbox 
                      label="Checked checkbox"
                      checked={true}
                      onChange={() => {}}
                    />
                    <Checkbox 
                      label="Disabled checkbox"
                      checked={false}
                      disabled
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Radio Buttons</h3>
                  <div className="space-y-4">
                    <Radio 
                      label="Option 1"
                      value="option1"
                      checked={radioValue === "option1"}
                      onChange={() => setRadioValue("option1")}
                    />
                    <Radio 
                      label="Option 2"
                      value="option2"
                      checked={radioValue === "option2"}
                      onChange={() => setRadioValue("option2")}
                    />
                    <Radio 
                      label="Disabled option"
                      value="option3"
                      checked={false}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Switch */}
        <section className="py-20 bg-slate-50 border-y-2 border-slate-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Switch Toggle</h2>
              
              <div className="space-y-4 max-w-md">
                <Switch 
                  label="Toggle switch (off)"
                  checked={false}
                  onChange={() => {}}
                />
                <Switch 
                  label="Toggle switch (on)"
                  checked={true}
                  onChange={() => {}}
                />
                <Switch 
                  label="Disabled switch"
                  checked={false}
                  disabled
                />
              </div>
            </div>
          </div>
        </section>

        {/* Textarea */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Textarea</h2>
              
              <div className="max-w-md space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Default Textarea</label>
                  <Textarea 
                    placeholder="Enter your message here..."
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Textarea with Error</label>
                  <Textarea 
                    placeholder="Enter your message here..."
                    rows={4}
                    error
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modal */}
        <section className="py-20 bg-slate-50 border-y-2 border-slate-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Modal</h2>
              
              <div>
                <Button variant="primary" onClick={() => setModalOpen(true)}>
                  Open Modal
                </Button>
                
                <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Example Modal">
                  <ModalContent>
                    <p className="text-slate-600 mb-4">
                      This is a modal dialog example. You can add any content here.
                    </p>
                    <p className="text-slate-600">
                      Click outside or the close button to dismiss.
                    </p>
                  </ModalContent>
                  <ModalFooter>
                    <Button variant="ghost" onClick={() => setModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={() => setModalOpen(false)}>
                      Confirm
                    </Button>
                  </ModalFooter>
                </Modal>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Tabs</h2>
              
              <div className="max-w-2xl">
                <Tabs defaultValue="tab1">
                  <TabsList>
                    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                    <TabsTrigger value="tab3">Tab 3</TabsTrigger>
                  </TabsList>
                  <TabsContent value="tab1">
                    <Card>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Tab 1 Content</h3>
                        <p className="text-slate-600">This is the content for the first tab.</p>
                      </div>
                    </Card>
                  </TabsContent>
                  <TabsContent value="tab2">
                    <Card>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Tab 2 Content</h3>
                        <p className="text-slate-600">This is the content for the second tab.</p>
                      </div>
                    </Card>
                  </TabsContent>
                  <TabsContent value="tab3">
                    <Card>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Tab 3 Content</h3>
                        <p className="text-slate-600">This is the content for the third tab.</p>
                      </div>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </section>

        {/* Spinner & Loading States */}
        <section className="py-20 bg-slate-50 border-y-2 border-slate-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Spinner & Loading States</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Spinner Sizes</h3>
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center gap-2">
                      <Spinner size="sm" />
                      <p className="text-xs text-slate-500">Small</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Spinner size="md" />
                      <p className="text-xs text-slate-500">Medium</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Spinner size="lg" />
                      <p className="text-xs text-slate-500">Large</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Section Skeleton</h3>
                  <SectionSkeleton height="h-[200px]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Avatar */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Avatar</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Avatar Sizes</h3>
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center gap-2">
                      <Avatar size="sm" fallback="A" />
                      <p className="text-xs text-slate-500">Small</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Avatar size="md" fallback="B" />
                      <p className="text-xs text-slate-500">Medium</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Avatar size="lg" fallback="C" />
                      <p className="text-xs text-slate-500">Large</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Avatar with Initials</h3>
                  <div className="flex items-center gap-4">
                    <Avatar fallback="JD" />
                    <Avatar fallback="AB" />
                    <Avatar fallback="RS" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tooltip */}
        <section className="py-20 bg-slate-50 border-y-2 border-slate-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Tooltip</h2>
              
              <div className="flex flex-wrap gap-4">
                <Tooltip content="This is a tooltip on top" side="top">
                  <Button variant="outline">Hover me (Top)</Button>
                </Tooltip>
                <Tooltip content="This is a tooltip on bottom" side="bottom">
                  <Button variant="outline">Hover me (Bottom)</Button>
                </Tooltip>
                <Tooltip content="This is a tooltip on left" side="left">
                  <Button variant="outline">Hover me (Left)</Button>
                </Tooltip>
                <Tooltip content="This is a tooltip on right" side="right">
                  <Button variant="outline">Hover me (Right)</Button>
                </Tooltip>
              </div>
            </div>
          </div>
        </section>

        {/* Separator */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Separator</h2>
              
              <div className="space-y-6">
                <div>
                  <p className="text-slate-600 mb-2">Content above</p>
                  <Separator />
                  <p className="text-slate-600 mt-2">Content below</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-slate-600">Left</span>
                  <Separator orientation="vertical" className="h-8" />
                  <span className="text-slate-600">Right</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Borders & Spacing */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Borders & Spacing</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Border Styles</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-2xl border-2 border-slate-200">
                      <p className="text-sm font-semibold text-slate-900 mb-1">Standard Border</p>
                      <p className="text-xs text-slate-500 font-mono">border-2 border-slate-200</p>
                    </div>
                    <div className="p-4 bg-white rounded-2xl border-2 border-[#005bbc]/20">
                      <p className="text-sm font-semibold text-slate-900 mb-1">Primary Border</p>
                      <p className="text-xs text-slate-500 font-mono">border-2 border-[#005bbc]/20</p>
                    </div>
                    <div className="p-4 bg-white rounded-2xl border-2 border-[#ffd600]/20">
                      <p className="text-sm font-semibold text-slate-900 mb-1">Accent Border</p>
                      <p className="text-xs text-slate-500 font-mono">border-2 border-[#ffd600]/20</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Border Radius</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-xl border-2 border-slate-200">
                      <p className="text-sm font-semibold text-slate-900 mb-1">Rounded XL</p>
                      <p className="text-xs text-slate-500 font-mono">rounded-xl</p>
                    </div>
                    <div className="p-4 bg-white rounded-2xl border-2 border-slate-200">
                      <p className="text-sm font-semibold text-slate-900 mb-1">Rounded 2XL</p>
                      <p className="text-xs text-slate-500 font-mono">rounded-2xl</p>
                    </div>
                    <div className="p-4 bg-white rounded-full border-2 border-slate-200">
                      <p className="text-sm font-semibold text-slate-900 mb-1">Rounded Full</p>
                      <p className="text-xs text-slate-500 font-mono">rounded-full</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Components */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">AI Components</h2>
              <p className="text-lg text-slate-600 mb-8">Special components for AI-themed interfaces</p>
              
              <div className="space-y-12">
                {/* Glow Orb */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Glow Orb</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="relative h-48 bg-slate-900 rounded-2xl border-2 border-slate-800 flex items-center justify-center overflow-hidden">
                      <GlowOrb size="sm" color="blue" position="relative" />
                      <p className="absolute bottom-4 text-white text-sm font-semibold">Small Blue</p>
                    </div>
                    <div className="relative h-48 bg-slate-900 rounded-2xl border-2 border-slate-800 flex items-center justify-center overflow-hidden">
                      <GlowOrb size="md" color="yellow" position="relative" />
                      <p className="absolute bottom-4 text-white text-sm font-semibold">Medium Yellow</p>
                    </div>
                    <div className="relative h-48 bg-slate-900 rounded-2xl border-2 border-slate-800 flex items-center justify-center overflow-hidden">
                      <GlowOrb size="lg" color="blue" position="relative" />
                      <p className="absolute bottom-4 text-white text-sm font-semibold">Large Blue</p>
                    </div>
                  </div>
                </div>

                {/* Voice Pulse Indicator */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Voice Pulse Indicator</h3>
                  <div className="flex items-center gap-8">
                    <div className="flex flex-col items-center gap-2">
                      <VoicePulseIndicator active={true} size="sm" />
                      <p className="text-xs text-slate-500">Active (Small)</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <VoicePulseIndicator active={true} size="md" />
                      <p className="text-xs text-slate-500">Active (Medium)</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <VoicePulseIndicator active={true} size="lg" />
                      <p className="text-xs text-slate-500">Active (Large)</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <VoicePulseIndicator active={false} size="md" />
                      <p className="text-xs text-slate-500">Idle</p>
                    </div>
                  </div>
                </div>

                {/* Gradient Text */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Gradient Text</h3>
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-4xl font-bold mb-2">
                        <GradientText gradient="blue">AI-Powered Customer Experience</GradientText>
                      </h2>
                      <p className="text-sm text-slate-500 font-mono">gradient=&quot;blue&quot;</p>
                    </div>
                    <div>
                      <h2 className="text-4xl font-bold mb-2">
                        <GradientText gradient="yellow">Magical Interactions</GradientText>
                      </h2>
                      <p className="text-sm text-slate-500 font-mono">gradient=&quot;yellow&quot;</p>
                    </div>
                    <div>
                      <h2 className="text-4xl font-bold mb-2">
                        <GradientText gradient="purple">Future of Support</GradientText>
                      </h2>
                      <p className="text-sm text-slate-500 font-mono">gradient=&quot;purple&quot;</p>
                    </div>
                  </div>
                </div>

                {/* AI Icons Showcase */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-6">AI Icons</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    <Card className="p-6 text-center">
                      <div className="w-16 h-16 bg-[#005bbc]/10 rounded-xl flex items-center justify-center mx-auto mb-4 border-2 border-[#005bbc]/20">
                        <Brain className="w-8 h-8 text-[#005bbc]" />
                      </div>
                      <p className="text-sm font-semibold text-slate-900">Brain</p>
                      <p className="text-xs text-slate-500">AI Intelligence</p>
                    </Card>
                    <Card className="p-6 text-center">
                      <div className="w-16 h-16 bg-[#ffd600]/10 rounded-xl flex items-center justify-center mx-auto mb-4 border-2 border-[#ffd600]/20">
                        <Sparkles className="w-8 h-8 text-[#ffd600]" />
                      </div>
                      <p className="text-sm font-semibold text-slate-900">Sparkles</p>
                      <p className="text-xs text-slate-500">AI Magic</p>
                    </Card>
                    <Card className="p-6 text-center">
                      <div className="w-16 h-16 bg-[#005bbc]/10 rounded-xl flex items-center justify-center mx-auto mb-4 border-2 border-[#005bbc]/20">
                        <Zap className="w-8 h-8 text-[#005bbc]" />
                      </div>
                      <p className="text-sm font-semibold text-slate-900">Zap</p>
                      <p className="text-xs text-slate-500">Speed</p>
                    </Card>
                    <Card className="p-6 text-center">
                      <div className="w-16 h-16 bg-[#005bbc]/10 rounded-xl flex items-center justify-center mx-auto mb-4 border-2 border-[#005bbc]/20">
                        <Bot className="w-8 h-8 text-[#005bbc]" />
                      </div>
                      <p className="text-sm font-semibold text-slate-900">Bot</p>
                      <p className="text-xs text-slate-500">AI Agent</p>
                    </Card>
                    <Card className="p-6 text-center">
                      <div className="w-16 h-16 bg-[#005bbc]/10 rounded-xl flex items-center justify-center mx-auto mb-4 border-2 border-[#005bbc]/20">
                        <MessageSquare className="w-8 h-8 text-[#005bbc]" />
                      </div>
                      <p className="text-sm font-semibold text-slate-900">Message</p>
                      <p className="text-xs text-slate-500">Communication</p>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* More Component Examples */}
        <section className="py-20 bg-slate-50 border-y-2 border-slate-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">More Component Examples</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Button Groups */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Button Groups</h3>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Button variant="primary" size="sm">Save</Button>
                      <Button variant="outline" size="sm">Cancel</Button>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="md">Primary Action</Button>
                      <Button variant="ghost" size="md">Secondary</Button>
                    </div>
                  </div>
                </div>

                {/* Icon Buttons */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Icon Buttons</h3>
                  <div className="flex gap-4">
                    <Button variant="primary" size="sm">
                      <Sparkles className="w-4 h-4" />
                      AI Action
                    </Button>
                    <Button variant="outline" size="sm">
                      <Zap className="w-4 h-4" />
                      Quick
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Brain className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Card with Header */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Card with Header</h3>
                  <Card>
                    <div className="p-6 border-b-2 border-slate-200">
                      <h4 className="text-lg font-bold text-slate-900">Card Title</h4>
                      <p className="text-sm text-slate-500">Card subtitle</p>
                    </div>
                    <div className="p-6">
                      <p className="text-slate-600">Card content goes here.</p>
                    </div>
                  </Card>
                </div>

                {/* Status Indicators */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Status Indicators</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border-2 border-green-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-semibold text-green-800">Online</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl border-2 border-yellow-200">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-yellow-800">Processing</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border-2 border-slate-200">
                      <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                      <span className="text-sm font-semibold text-slate-700">Offline</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Chat Interface Example */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">AI Chat Interface Example</h2>
              
              <Card className="max-w-2xl mx-auto">
                <div className="p-6">
                  <div className="h-14 bg-gradient-to-r from-[#005bbc] to-[#004a9f] rounded-xl flex items-center justify-between px-5 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">AI Customer Support</div>
                        <div className="text-xs text-white/80">Answering questions automatically</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <VoicePulseIndicator active={true} size="sm" />
                      <span className="text-xs text-white/90 font-medium">Live</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 p-4 bg-slate-50 rounded-xl">
                    <div className="flex gap-2">
                      <Avatar fallback="C" size="sm" />
                      <div className="flex-1">
                        <div className="bg-white p-3 rounded-2xl rounded-tl-none border-2 border-slate-200">
                          <p className="text-sm text-slate-700">How can I help you today?</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <div className="max-w-[80%]">
                        <div className="bg-[#005bbc] p-3 rounded-2xl rounded-tr-none flex items-start gap-2 border-2 border-[#005bbc]">
                          <Sparkles className="w-4 h-4 text-white shrink-0 mt-0.5" />
                          <p className="text-sm text-white">I&apos;m here to help! What would you like to know?</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-2">
                    <Input placeholder="Type your message..." className="flex-1" />
                    <Button variant="primary" size="sm">
                      <Sparkles className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* AI Chat Interface - ChatGPT Style */}
        <section className="py-20 bg-slate-50 border-y-2 border-slate-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">AI Chat Interface - ChatGPT Style</h2>
              <p className="text-lg text-slate-600 mb-8">Full-featured chat interface similar to ChatGPT</p>
              
              <Card className="max-w-4xl mx-auto">
                <div className="h-[600px] flex flex-col bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b-2 border-slate-200 bg-slate-50">
                    <div className="flex items-center gap-3">
                      <Logo size="sm" />
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">AI Assistant</h3>
                        <p className="text-xs text-slate-500">Always ready to help</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <VoicePulseIndicator active={true} size="sm" />
                      <Badge variant="success">Online</Badge>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
                    {/* AI Message */}
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#005bbc]/10 flex items-center justify-center shrink-0 border-2 border-[#005bbc]/20">
                        <Bot className="w-5 h-5 text-[#005bbc]" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-slate-50 rounded-2xl rounded-tl-none p-4 border-2 border-slate-200">
                          <p className="text-sm text-slate-700 leading-relaxed">
                            Hello! I&apos;m your AI assistant. How can I help you today?
                          </p>
                        </div>
                        <p className="text-xs text-slate-400 mt-2 ml-1">Just now</p>
                      </div>
                    </div>

                    {/* User Message */}
                    <div className="flex gap-4 justify-end">
                      <div className="flex-1 max-w-[80%]">
                        <div className="bg-[#005bbc] rounded-2xl rounded-tr-none p-4 border-2 border-[#005bbc]">
                          <p className="text-sm text-white leading-relaxed">
                            Can you explain how AI customer support works?
                          </p>
                        </div>
                        <p className="text-xs text-slate-400 mt-2 mr-1 text-right">Just now</p>
                      </div>
                      <Avatar size="sm" fallback="U" />
                    </div>

                    {/* AI Message with Code */}
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#005bbc]/10 flex items-center justify-center shrink-0 border-2 border-[#005bbc]/20">
                        <Bot className="w-5 h-5 text-[#005bbc]" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-slate-50 rounded-2xl rounded-tl-none p-4 border-2 border-slate-200">
                          <p className="text-sm text-slate-700 leading-relaxed mb-3">
                            AI customer support uses machine learning to:
                          </p>
                          <ul className="list-disc list-inside space-y-1 text-sm text-slate-700 mb-3">
                            <li>Understand customer questions naturally</li>
                            <li>Provide instant, accurate responses</li>
                            <li>Learn from each conversation</li>
                            <li>Escalate complex issues to humans</li>
                          </ul>
                          <div className="mt-3 p-3 bg-slate-900 rounded-xl border-2 border-slate-800">
                            <code className="text-xs text-green-400 font-mono">
                              {`// AI processes context in real-time
const response = await ai.analyze(message);
return response;`}
                            </code>
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-2 ml-1">Just now</p>
                      </div>
                    </div>
                  </div>

                  {/* Input Area */}
                  <div className="p-4 border-t-2 border-slate-200 bg-white">
                    <div className="flex items-end gap-3">
                      <div className="flex-1">
                        <Textarea 
                          placeholder="Type your message here..."
                          rows={1}
                          className="resize-none min-h-[60px] max-h-[200px]"
                        />
                      </div>
                      <Button variant="primary" size="lg" className="h-[60px] px-6">
                        <Sparkles className="w-5 h-5" />
                      </Button>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 text-center">
                      AI can make mistakes. Check important info.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* AI Chat with Sidebar */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">AI Chat with Sidebar</h2>
              <p className="text-lg text-slate-600 mb-8">Full layout with conversation history</p>
              
              <Card className="max-w-6xl mx-auto">
                <div className="h-[600px] flex bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
                  {/* Sidebar */}
                  <div className="w-64 border-r-2 border-slate-200 bg-slate-50 flex flex-col">
                    <div className="p-4 border-b-2 border-slate-200">
                      <Button variant="primary" className="w-full">
                        <Sparkles className="w-4 h-4 mr-2" />
                        New Chat
                      </Button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2">
                      <div className="space-y-1">
                        <div className="p-3 rounded-xl bg-[#005bbc]/10 border-2 border-[#005bbc]/20 cursor-pointer hover:bg-[#005bbc]/20 transition-colors">
                          <p className="text-sm font-semibold text-slate-900 truncate">Customer Support</p>
                          <p className="text-xs text-slate-500 mt-1">2 hours ago</p>
                        </div>
                        <div className="p-3 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors">
                          <p className="text-sm font-semibold text-slate-700 truncate">Product Questions</p>
                          <p className="text-xs text-slate-500 mt-1">Yesterday</p>
                        </div>
                        <div className="p-3 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors">
                          <p className="text-sm font-semibold text-slate-700 truncate">Technical Help</p>
                          <p className="text-xs text-slate-500 mt-1">2 days ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border-t-2 border-slate-200">
                      <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors">
                        <Avatar size="sm" fallback="JD" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">John Doe</p>
                          <p className="text-xs text-slate-500 truncate">john@example.com</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Main Chat Area */}
                  <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b-2 border-slate-200 bg-white">
                      <div className="flex items-center gap-3">
                        <Bot className="w-5 h-5 text-[#005bbc]" />
                        <h3 className="text-sm font-bold text-slate-900">AI Assistant</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Zap className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Brain className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#005bbc]/10 flex items-center justify-center shrink-0 border-2 border-[#005bbc]/20">
                          <Bot className="w-5 h-5 text-[#005bbc]" />
                        </div>
                        <div className="flex-1">
                          <div className="bg-slate-50 rounded-2xl rounded-tl-none p-4 border-2 border-slate-200">
                            <p className="text-sm text-slate-700 leading-relaxed">
                              How can I assist you today?
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t-2 border-slate-200 bg-white">
                      <div className="flex items-end gap-3">
                        <div className="flex-1">
                          <Input placeholder="Message AI..." className="min-h-[50px]" />
                        </div>
                        <Button variant="primary" size="lg" className="h-[50px] px-6">
                          <Sparkles className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* AI Response Components */}
        <section className="py-20 bg-slate-50 border-y-2 border-slate-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">AI Response Components</h2>
              <p className="text-lg text-slate-600 mb-8">Individual AI message components</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Simple AI Response */}
                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Simple Response</h3>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#005bbc]/10 flex items-center justify-center shrink-0 border-2 border-[#005bbc]/20">
                        <Bot className="w-5 h-5 text-[#005bbc]" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-slate-50 rounded-2xl rounded-tl-none p-4 border-2 border-slate-200">
                          <p className="text-sm text-slate-700">
                            This is a simple AI response message.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* AI Response with Actions */}
                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Response with Actions</h3>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#005bbc]/10 flex items-center justify-center shrink-0 border-2 border-[#005bbc]/20">
                        <Bot className="w-5 h-5 text-[#005bbc]" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-slate-50 rounded-2xl rounded-tl-none p-4 border-2 border-slate-200">
                          <p className="text-sm text-slate-700 mb-3">
                            Would you like me to help with something specific?
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            <Button variant="outline" size="sm">Explain more</Button>
                            <Button variant="outline" size="sm">Show examples</Button>
                            <Button variant="outline" size="sm">Get started</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* AI Response with Code */}
                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Response with Code</h3>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#005bbc]/10 flex items-center justify-center shrink-0 border-2 border-[#005bbc]/20">
                        <Bot className="w-5 h-5 text-[#005bbc]" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-slate-50 rounded-2xl rounded-tl-none p-4 border-2 border-slate-200">
                          <p className="text-sm text-slate-700 mb-3">
                            Here&apos;s a code example:
                          </p>
                          <div className="p-3 bg-slate-900 rounded-xl border-2 border-slate-800">
                            <code className="text-xs text-green-400 font-mono">
                              {`const ai = new AIAssistant();
ai.respond("Hello!");`}
                            </code>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* AI Response with List */}
                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Response with List</h3>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#005bbc]/10 flex items-center justify-center shrink-0 border-2 border-[#005bbc]/20">
                        <Bot className="w-5 h-5 text-[#005bbc]" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-slate-50 rounded-2xl rounded-tl-none p-4 border-2 border-slate-200">
                          <p className="text-sm text-slate-700 mb-2 font-semibold">Key features:</p>
                          <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                            <li>Natural language processing</li>
                            <li>Real-time responses</li>
                            <li>Context awareness</li>
                            <li>Multi-language support</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Real-World Examples */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Real-World Examples</h2>
              <p className="text-lg text-slate-600 mb-8">Simple, clean examples matching our brand</p>
              
              <div className="space-y-12">
                {/* Dashboard Header */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Dashboard Header</h3>
                  <Card>
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Logo size="sm" />
                          <div>
                            <h4 className="text-lg font-bold text-slate-900">Replyxbase</h4>
                            <p className="text-sm text-slate-500">AI Customer Support</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="success">Active</Badge>
                          <Button variant="primary" size="sm">Settings</Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Stats Card Grid */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Stats Dashboard</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-sm text-slate-500">Total Conversations</p>
                          <MessageSquare className="w-5 h-5 text-[#005bbc]" />
                        </div>
                        <p className="text-3xl font-bold text-slate-900 mb-1">1,234</p>
                        <p className="text-xs text-green-600 font-semibold">+12% from last month</p>
                      </div>
                    </Card>
                    <Card>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-sm text-slate-500">Response Time</p>
                          <Zap className="w-5 h-5 text-[#ffd600]" />
                        </div>
                        <p className="text-3xl font-bold text-slate-900 mb-1">0.8s</p>
                        <p className="text-xs text-green-600 font-semibold">-25% faster</p>
                      </div>
                    </Card>
                    <Card>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-sm text-slate-500">Satisfaction</p>
                          <Brain className="w-5 h-5 text-[#005bbc]" />
                        </div>
                        <p className="text-3xl font-bold text-slate-900 mb-1">98%</p>
                        <p className="text-xs text-green-600 font-semibold">+5% improvement</p>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Simple Form */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Contact Form</h3>
                  <Card className="max-w-2xl">
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-slate-900 mb-6">Get in Touch</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
                          <Input placeholder="Your name" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                          <Input type="email" placeholder="your@email.com" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                          <Textarea placeholder="Your message..." rows={4} />
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox label="I agree to the terms" />
                        </div>
                        <Button variant="primary" className="w-full">Send Message</Button>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Quick Stats */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Quick Stats</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card variant="primary" className="p-4 text-center">
                      <p className="text-2xl font-bold text-[#005bbc] mb-1">24/7</p>
                      <p className="text-xs text-slate-600">Support</p>
                    </Card>
                    <Card variant="accent" className="p-4 text-center">
                      <p className="text-2xl font-bold text-[#ffd600] mb-1">99.9%</p>
                      <p className="text-xs text-slate-600">Uptime</p>
                    </Card>
                    <Card className="p-4 text-center">
                      <p className="text-2xl font-bold text-slate-900 mb-1">50K+</p>
                      <p className="text-xs text-slate-600">Users</p>
                    </Card>
                    <Card className="p-4 text-center">
                      <p className="text-2xl font-bold text-slate-900 mb-1">1M+</p>
                      <p className="text-xs text-slate-600">Messages</p>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Component Reference */}
        <section className="py-20 bg-slate-50 border-y-2 border-slate-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Component Reference</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">components.json</h3>
                    <p className="text-slate-600 mb-4">
                      Complete documentation for all UI components including props, variants, usage examples, and design system tokens.
                    </p>
                    <code className="block px-3 py-2 bg-slate-100 rounded text-sm font-mono text-slate-700">
                      components/ui/components.json
                    </code>
                  </div>
                </Card>
                
                <Card>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Design System</h3>
                    <p className="text-slate-600 mb-4">
                      Full design system guidelines, color palette, typography, and component patterns.
                    </p>
                    <code className="block px-3 py-2 bg-slate-100 rounded text-sm font-mono text-slate-700">
                      DESIGN_SYSTEM.md
                    </code>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

"use client"

import { useState } from "react"
import { z } from "zod"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Form, FormField, useForm, zodResolver } from "@/components/ui/Form"
import { Modal, ModalHeader, ModalContent, ModalFooter } from "@/components/ui/Modal"
import { useToast } from "@/components/ui/Toast"
import { ErrorBoundary } from "@/components/ui/ErrorBoundary"

// Test form schema
const testFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^(\+63|0)[9]\d{9}$/, "Invalid Philippine phone number"),
})

type TestFormValues = z.infer<typeof testFormSchema>

// Simulated API call that might fail
const simulateAPICall = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  // Randomly fail
  if (Math.random() > 0.5) {
    throw new Error("[TEST ERROR] This is a simulated error to demonstrate error handling. Click 'Try again' to test again.")
  }
  return { success: true }
}

function ErrorTest() {
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  const handleTestError = async () => {
    try {
      setLoading(true)
      const result = await simulateAPICall()
      setLoading(false)
      // If successful, show success toast
      showToast({
        title: "Success",
        description: "The simulated API call was successful! Try again to potentially see an error.",
        type: "success",
      })
    } catch (error) {
      setLoading(false)
      // This error will be caught by the ErrorBoundary
      throw error
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-surface-secondary p-4 text-sm text-text-secondary">
        <p>This is a test component that simulates API errors. Each click has a 50% chance to:</p>
        <ul className="list-disc ml-4 mt-2 space-y-1">
          <li>Succeed and show a success message</li>
          <li>Fail and demonstrate the error boundary</li>
        </ul>
      </div>
      <Button 
        onClick={handleTestError}
        disabled={loading}
      >
        {loading ? "Loading..." : "Test Error Handling"}
      </Button>
    </div>
  )
}

export default function TestPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { showToast } = useToast()

  const form = useForm<TestFormValues>({
    resolver: zodResolver(testFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  })

  const onSubmit = (data: TestFormValues) => {
    showToast({
      title: "Form submitted",
      description: `Name: ${data.name}, Email: ${data.email}, Phone: ${data.phone}`,
      type: "success",
    })
  }

  return (
    <div className="container py-8">
      <h1 className="heading-display text-3xl mb-8">Component Test Page</h1>

      {/* Card Test */}
      <section className="mb-8">
        <h2 className="heading-accent text-xl mb-4">Card Component</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
              <CardDescription>Testing card component</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary">Card content goes here</p>
            </CardContent>
            <CardFooter>
              <Button>Action</Button>
            </CardFooter>
          </Card>

          <Card variant="interactive">
            <CardHeader>
              <CardTitle>Interactive Card</CardTitle>
              <CardDescription>Click me!</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary">This card has hover states</p>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Elevated Card</CardTitle>
              <CardDescription>With shadow</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary">This card is elevated</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Form Test */}
      <section className="mb-8">
        <h2 className="heading-accent text-xl mb-4">Form Components</h2>
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Test Form</CardTitle>
            <CardDescription>Testing form components</CardDescription>
          </CardHeader>
          <CardContent>
            <Form form={form} onSubmit={onSubmit}>
              <FormField
                name="name"
                label="Name"
                error={form.formState.errors.name?.message}
              >
                <Input
                  {...form.register("name")}
                  placeholder="Enter your name"
                  error={!!form.formState.errors.name}
                />
              </FormField>

              <FormField
                name="email"
                label="Email"
                error={form.formState.errors.email?.message}
              >
                <Input
                  {...form.register("email")}
                  type="email"
                  placeholder="Enter your email"
                  error={!!form.formState.errors.email}
                />
              </FormField>

              <FormField
                name="phone"
                label="Phone"
                error={form.formState.errors.phone?.message}
              >
                <Input
                  {...form.register("phone")}
                  placeholder="09XXXXXXXXX"
                  error={!!form.formState.errors.phone}
                />
              </FormField>

              <Button type="submit" className="w-full">
                Submit
              </Button>
            </Form>
          </CardContent>
        </Card>
      </section>

      {/* Modal Test */}
      <section className="mb-8">
        <h2 className="heading-accent text-xl mb-4">Modal Component</h2>
        <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ModalHeader>Test Modal</ModalHeader>
          <ModalContent>
            <p className="text-text-secondary">
              This is a test modal to verify the modal component is working correctly.
            </p>
          </ModalContent>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setIsModalOpen(false)
              showToast({
                title: "Action completed",
                description: "Modal action was successful",
                type: "success",
              })
            }}>
              Confirm
            </Button>
          </ModalFooter>
        </Modal>
      </section>

      {/* Toast Test */}
      <section className="mb-8">
        <h2 className="heading-accent text-xl mb-4">Toast Component</h2>
        <div className="flex gap-4">
          <Button
            onClick={() =>
              showToast({
                title: "Success Toast",
                description: "This is a success message",
                type: "success",
              })
            }
          >
            Show Success
          </Button>
          <Button
            onClick={() =>
              showToast({
                title: "Error Toast",
                description: "This is an error message",
                type: "error",
              })
            }
          >
            Show Error
          </Button>
          <Button
            onClick={() =>
              showToast({
                title: "Info Toast",
                description: "This is an info message",
                type: "info",
              })
            }
          >
            Show Info
          </Button>
        </div>
      </section>

      {/* Error Boundary Test */}
      <section className="mb-8">
        <h2 className="heading-accent text-xl mb-4">Error Boundary</h2>
        <p className="text-text-secondary mb-4">
          Click the button below to test error handling. It will randomly fail to simulate API errors.
        </p>
        <ErrorBoundary>
          <ErrorTest />
        </ErrorBoundary>
      </section>
    </div>
  )
} 
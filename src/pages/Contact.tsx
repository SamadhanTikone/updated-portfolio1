import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navigation from "@/components/Navigation";
import SocialLinks from "@/components/SocialLinks";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface SubmissionState {
  status: "idle" | "loading" | "success" | "error";
  message: string;
}

const Contact = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submission, setSubmission] = useState<SubmissionState>({
    status: "idle",
    message: "",
  });

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate individual field
  const validateField = (name: keyof FormData, value: string): string => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (value.trim().length < 2)
          return "Name must be at least 2 characters";
        return "";
      case "email":
        if (!value.trim()) return "Email is required";
        if (!emailRegex.test(value))
          return "Please enter a valid email address";
        return "";
      case "subject":
        if (!value.trim()) return "Subject is required";
        if (value.trim().length < 3)
          return "Subject must be at least 3 characters";
        return "";
      case "message":
        if (!value.trim()) return "Message is required";
        if (value.trim().length < 10)
          return "Message must be at least 10 characters";
        return "";
      default:
        return "";
    }
  };

  // Validate entire form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const field = key as keyof FormData;
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const field = name as keyof FormData;

    // Update form data with functional update
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));

    // Clear error for this field if user is typing
    if (errors[field]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: "",
      }));
    }

    // Clear submission message when user starts typing again
    if (submission.status !== "idle") {
      setSubmission({ status: "idle", message: "" });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Set loading state
    setSubmission({ status: "loading", message: "" });

    try {
      // For demo purposes, simulate success since endpoint doesn't exist
      console.log("Simulating successful submission:", formData);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmission({
        status: "success",
        message:
          "Thank you! Your message has been sent successfully. I'll get back to you soon.",
      });

      // Clear form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setErrors({});

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSubmission({ status: "idle", message: "" });
      }, 5000);
    } catch (error) {
      setSubmission({
        status: "error",
        message:
          "Failed to send message. Please try again later or contact me directly via email.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                🤝 Get In <span className="text-portfolio-teal">Touch</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Let's discuss your next project or just say hello!
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-card border border-border rounded-lg p-8 shadow-lg"
              >
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Send Message
                </h2>

                {/* Submission Status Messages */}
                <AnimatePresence>
                  {submission.status === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mb-6"
                    >
                      <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800 dark:text-green-200">
                          {submission.message}
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}

                  {submission.status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mb-6"
                    >
                      <Alert className="border-red-500 bg-red-50 dark:bg-red-950">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800 dark:text-red-200">
                          {submission.message}
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      className={`w-full transition-colors ${
                        errors.name
                          ? "border-red-500 focus-visible:ring-red-500"
                          : "focus-visible:ring-portfolio-teal"
                      }`}
                      aria-invalid={!!errors.name}
                    />
                    <AnimatePresence>
                      {errors.name && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-2 text-red-500 text-sm"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {errors.name}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className={`w-full transition-colors ${
                        errors.email
                          ? "border-red-500 focus-visible:ring-red-500"
                          : "focus-visible:ring-portfolio-teal"
                      }`}
                      aria-invalid={!!errors.email}
                    />
                    <AnimatePresence>
                      {errors.email && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-2 text-red-500 text-sm"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {errors.email}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Subject Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What's this about?"
                      className={`w-full transition-colors ${
                        errors.subject
                          ? "border-red-500 focus-visible:ring-red-500"
                          : "focus-visible:ring-portfolio-teal"
                      }`}
                      aria-invalid={!!errors.subject}
                    />
                    <AnimatePresence>
                      {errors.subject && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-2 text-red-500 text-sm"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {errors.subject}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Message Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell me about your project or just say hello..."
                      rows={5}
                      className={`w-full transition-colors ${
                        errors.message
                          ? "border-red-500 focus-visible:ring-red-500"
                          : "focus-visible:ring-portfolio-teal"
                      }`}
                      aria-invalid={!!errors.message}
                    />
                    <AnimatePresence>
                      {errors.message && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-2 text-red-500 text-sm"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {errors.message}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Button
                    type="submit"
                    disabled={submission.status === "loading"}
                    className="w-full bg-portfolio-teal hover:bg-portfolio-teal/90 text-white group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submission.status === "loading" ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2 group-hover:animate-bounce-gentle" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-8"
              >
                <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Contact Information
                  </h2>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-portfolio-teal/10 rounded-lg flex items-center justify-center">
                        <Mail className="w-6 h-6 text-portfolio-teal" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Email</p>
                        <a
                          href="mailto:tikonesamadhan03@gmail.com"
                          className="text-muted-foreground hover:text-portfolio-teal transition-colors"
                        >
                          tikonesamadhan03@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-portfolio-teal/10 rounded-lg flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-portfolio-teal" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Location</p>
                        <p className="text-muted-foreground">Pune, India</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
                  <h3 className="text-xl font-bold text-foreground mb-4">
                    Follow Me
                  </h3>
                  <SocialLinks showLabels />
                </div>

                {/* Response Time Notice */}
                <div className="bg-portfolio-teal/10 border border-portfolio-teal/20 rounded-lg p-6">
                  <h4 className="font-semibold text-portfolio-teal mb-2">
                    Quick Response
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    I typically respond to messages within 24 hours. For urgent
                    matters, feel free to reach out directly via email.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;

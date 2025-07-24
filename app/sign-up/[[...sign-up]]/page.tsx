"use client";
import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen flex">
      {/* Global styles to hide Clerk banners and social providers */}
      <style jsx global>{`
        .cl-internal-b3fm6y,
        .cl-footer,
        .cl-modalCloseButton,
        .cl-developmentBanner,
        .cl-internal-1ta6rch,
        .cl-internal-1vfjj7t,
        .cl-socialButtonsBlockButton {
          display: none !important;
        }
      `}</style>{" "}
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div
          className="w-full bg-cover bg-center bg-gray-900"
          style={{
            backgroundImage: "url('/bg.jpeg')",
          }}
        >
          {/* Black opacity overlay */}
          <div className="absolute inset-0 bg-black opacity-60"></div>

          {/* Centered welcome text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="flex justify-center items-center">
                <h1 className="text-5xl">Welcome to</h1>
                <Image
                  src="/lumi.png"
                  alt="Lumi Logo"
                  width={200}
                  height={140}
                  className=""
                  style={{
                    filter:
                      "brightness(1) contrast(1.1) drop-shadow(0 0 4px rgba(236, 0, 110, 0.6)) drop-shadow(0 0 8px rgba(71, 1, 235, 0.4)) drop-shadow(0 0 12px rgba(139, 92, 246, 0.2))",
                  }}
                />
              </div>
              <p className="text-xl opacity-90">
                Create and explore AI-powered educational animations
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Right side - Enhanced Form */}
      <div className="w-full lg:w-1/2 bg-[#161616] flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Custom Header */}
          <div className="text-center ">
            <h2 className="text-4xl font-medium text-white mb-3">
              Sign Up to Lumi
            </h2>
            <p className="text-gray-400 ">
              Hello There! Please Make an account to continue
            </p>
            {/* Sign up link */}
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-purple-400 hover:text-purple-300 underline font-semibold"
              >
                Login
              </Link>
            </p>{" "}
          </div>
          {/* Modern Card Container */}
          <div className=" backdrop-blur-sm  rounded-2xl p-2 ">
            <div className="flex justify-center">
              <SignUp
                appearance={{
                  elements: {
                    rootBox:
                      "w-full flex justify-center border rounded-lg mt-4 shadow-2xl ",
                    card: "bg-[#161616] shadow-none border-none w-full",
                    headerTitle: "hidden", // Hide default title since we have custom
                    headerSubtitle: "hidden", // Hide default subtitle
                    dividerLine: "bg-gray-600",
                    dividerText: "text-gray-400",
                    formFieldLabel: "text-gray-300 font-medium mb-2",

                    formFieldInput:
                      "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl px-4 py-3 transition-all duration-200 backdrop-blur-sm",
                    formButtonPrimary:
                      "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-purple-500/25 transform hover:scale-[1.02]",
                    identityPreviewText: "text-gray-300",
                    identityPreviewEditButton:
                      "text-purple-400 hover:text-purple-300",
                    formResendCodeLink: "text-purple-400 hover:text-purple-300",
                    otpCodeFieldInput:
                      "bg-gray-700/50 border-gray-600 text-white rounded-xl",
                    alternativeMethodsBlockButton:
                      "text-purple-400 hover:text-purple-300",
                    phoneInputBox: "bg-gray-700/50 border-gray-600 rounded-xl",
                    selectButton:
                      "bg-gray-700/50 border-gray-600 text-white rounded-xl",
                    selectSearchInput: "bg-gray-700/50 text-white rounded-xl",
                    selectOption: "text-white hover:bg-gray-700",
                    footer: "hidden",
                    footerAction: "hidden",
                    footerActionText: "hidden",
                    internal: "hidden",
                    socialButtonsBlockButton: "hidden",
                    socialButtonsBlockButtonText: "hidden",
                    socialButtonsProviderIcon: "hidden",
                    dividerRow: "hidden",
                  },
                  layout: {
                    socialButtonsPlacement: "bottom",
                    showOptionalFields: true,
                  },
                  variables: {
                    colorPrimary: "#9333ea",
                    colorBackground: "transparent",
                    colorInputBackground: "rgba(55, 65, 81, 0.5)",
                    colorInputText: "#ffffff",
                    colorText: "#ffffff",
                    colorTextSecondary: "#9ca3af",
                    borderRadius: "0.75rem",
                    spacingUnit: "1rem",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

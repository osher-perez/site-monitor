import { RegisterForm } from "@/components/auth/RegisterForm";

export default function AuthPage() {
  return (
    // העמוד עוטף את הטופס החכם ודואג למרכז אותו בצורה נקייה ויפה על המסך בסטייל Light Mode נקי
    <div className="min-h-[calc(100vh-140px)] bg-gray-50/50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* קריאה חלקה לקומפוננטה שמנהלת את שלבי המייל והאזהרות החכמות */}
        <RegisterForm />
        
      </div>
    </div>
  );
}
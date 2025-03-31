import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import FakerApi from "@/services/fakerApi";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import * as z from "zod";
import KeyboardImage from "public/keyboard.jpg";
import { useEffect } from "react";

const FormSchema = z.object({
  username: z
    .string({
      required_error: "O email é obrigatório.",
    })
    .email({
      message: "Informe um endereço de email válido.",
    }),
  password: z.string({
    required_error: "A senha é obrigatória.",
  }),
});

const Signin = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const router = useRouter();
  const fakeApi = new FakerApi();
  const { toast } = useToast();
  const onSubmit = (data: z.infer<typeof FormSchema>) =>
    fakeApi
      .post("/login", data)
      .then((res) => router.push("/"))
      .catch((err) =>
        toast({
          variant: "destructive",
          title: "Erro",
          description: err.message,
        })
      );

  useEffect(() => {
    const getUser = () =>
      fakeApi.get("/me", {}).then((res) => {
        router.push("/");
      });
    getUser();
  }, []);

  return (
    <div className="flex min-h-screen flex-1">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <h2 className="mt-6 text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Faça login na sua conta
          </h2>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 mt-10"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Informe seu email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input placeholder="Informe a sua senha" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </Form>
          <div className="mt-10 relative">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm font-medium leading-6">
              <span className="bg-white px-6 text-gray-900">ou</span>
            </div>
          </div>
          <div className="mt-6">
            <Link href="/signup">
              <Button variant="secondary" className="w-full">
                Criar Conta
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <Image
          className="absolute inset-0 object-cover"
          src={KeyboardImage}
          alt=""
          fill
          placeholder="blur"
        />
      </div>
    </div>
  );
};

export default Signin;

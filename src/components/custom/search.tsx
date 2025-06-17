
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { SearchIcon } from "lucide-react";
import { z } from "zod";
import { Button } from "../ui/button";

const formSchema = z.object({
  search: z.string().min(1, {
    message: "Busqueda requerida",
  }),
});

const SearchForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  return (
    <div className="flex items-center justify-center gap-2 align-baseline w-full space-y-2 mt-10">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center justify-center gap-2 align-baseline w-full space-y-2"
        >
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem className="align-middle">
                <FormLabel hidden>Buscar</FormLabel>
                <FormControl>
                  <Input placeholder="Buscar" {...field} />
                </FormControl>
                <FormDescription hidden>Buscar productos</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className=" font-semibold py-3 px-8 rounded-lg transition-colors duration-300 shadow-lg align-middle"
            variant="ghost"
          >
            <SearchIcon className="w-4 h-4" />
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SearchForm;

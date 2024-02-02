import { useAtom } from 'jotai';
import { useForm } from 'react-hook-form';

import Dialog from '@/components/custom/Dialog';
import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FolderConfig, configAtom, useDBListStore } from '@/stores/dbList';

type ConfigFormType = {
  cwd: string;
};

export default function ConfigDialog() {
  const updateCwd = useDBListStore((state) => state.setCwd);

  const [db, setContext] = useAtom(configAtom);

  const handleSubmit = ({ cwd }: ConfigFormType) => {
    updateCwd(cwd, db!.id);
    handClose();
  };

  const handClose = () => {
    setContext(null);
  };
  const form = useForm<{ cwd: string }>({
    defaultValues: { cwd: (db?.config as FolderConfig)?.cwd ?? '' },
  });

  return (
    <Dialog
      open={db != null}
      onOpenChange={handClose}
      title={db?.displayName ?? db?.id ?? ''}
    >
      <DialogDescription>
        Set working directory for the read parquet relative path
      </DialogDescription>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="cwd"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Working Directory</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="submit">Ok</Button>
          </DialogFooter>
        </form>
      </Form>
    </Dialog>
  );
}

export function useToast() {
  return {
    toast: ({ title, description }: { title: string; description: string }) => {
      console.info("Toast:", title, description);
    },
  };
}

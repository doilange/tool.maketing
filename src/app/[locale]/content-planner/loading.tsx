export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-[60vh] gap-4">
      <div className="relative flex items-center justify-center w-16 h-16">
        <div className="absolute w-full h-full border-4 border-violet-500/20 rounded-full"></div>
        <div className="absolute w-full h-full border-4 border-violet-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <div className="text-sm font-medium text-muted-foreground animate-pulse">
        กำลังโหลดข้อมูล...
      </div>
    </div>
  );
}

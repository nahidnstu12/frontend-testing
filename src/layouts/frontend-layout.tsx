
export default function FrontendLayout({ children }: { children: React.ReactNode; }) {
    return (
        <div className="flex flex-col min-h-svh">
            
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}

export default function HowItWorks() {
    const steps = [
        {
            number: '01',
            title: 'Choose Your Services',
            description: 'Select from our range of modular solutions tailored to your specific business needs.'
        },
        {
            number: '02',
            title: 'Quick Setup',
            description: 'Our team helps you integrate the systems seamlessly into your existing workflow.'
        },
        {
            number: '03',
            title: 'Scale & Grow',
            description: 'Focus on what matters most—your customers—while our systems handle the rest.'
        }
    ]

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute right-0 bottom-0 -z-10 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />

            <div className="container mx-auto px-4">
                <div className="text-center mb-20 animate-fade-in">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">How It Works</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg text-balance">
                        Starting with FirstStep is simple, fast, and designed to minimize disruption.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-[2.5rem] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent -z-10" />

                    {steps.map((step, index) => (
                        <div key={index} className={`flex flex-col items-center text-center animate-fade-in stagger-${index + 1}`}>
                            <div className="h-20 w-20 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold shadow-xl shadow-primary/20 mb-8 transform transition-transform hover:scale-110 hover:rotate-3">
                                {step.number}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

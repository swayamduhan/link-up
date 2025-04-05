import StackedPop from "./StackedPop";

// contains 
export default function AboutSection(){
    return (
        <section className="mt-20 space-y-20">
            <div className="text-[2.5rem] text-center">How to LinkUp?</div>

            {/* Stacked Pops container */}
            <div className="px-20 mb-40">
                <StackedPop title="This is title">
                    This is content
                </StackedPop>
            </div>
        </section>
    )
}
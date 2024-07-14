import { LandingHeader } from "./LandingHeader";
import Problems from "./Problems";
export default function Landing(){
    return <div>
        <LandingHeader/>
        <section className="bg-white dark:bg-gray-900 py-8 md:py-12">
          <div className="container mx-auto px-4 md:px-6">
            <Problems />
          </div>
        </section>
    </div>
}
import { RuttEtraCore,     RuttEtraDisplay }    from './RuttEtra/RuttEtra';
import { SynthesizerCore,  SynthesizerDisplay } from './Synthesizer/Synthesizer';
import SynthesizerController                    from './Synthesizer/SynthesizerController';
import RuttEtraController                       from './RuttEtra/RuttEtraController';

var effectFactory = {
    lookupComponentByName: function(name) {
        let lookup = {
            'SynthesizerDisplay':    SynthesizerDisplay,
            'SynthesizerController': SynthesizerController,
            'SynthesizerCore':       SynthesizerCore,
            'RuttEtraDisplay':       RuttEtraDisplay,
            'RuttEtraController':    RuttEtraController,
            'RuttEtraCore':          RuttEtraCore,
        };

        return lookup[name];
    }
};

export default effectFactory;

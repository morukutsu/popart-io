import { RuttEtraCore,     RuttEtraDisplay }    from './RuttEtra/RuttEtra';
import RuttEtraController                       from './RuttEtra/RuttEtraController';
import { SynthesizerCore,  SynthesizerDisplay } from './Synthesizer/Synthesizer';
import SynthesizerController                    from './Synthesizer/SynthesizerController';
import { MosaicCore,  MosaicDisplay }           from './Mosaic/Mosaic';
import MosaicController                         from './Mosaic/MosaicController';

var effectFactory = {
    lookupComponentByName: function(name) {
        let lookup = {
            'SynthesizerDisplay':    SynthesizerDisplay,
            'SynthesizerController': SynthesizerController,
            'SynthesizerCore':       SynthesizerCore,
            'RuttEtraDisplay':       RuttEtraDisplay,
            'RuttEtraController':    RuttEtraController,
            'RuttEtraCore':          RuttEtraCore,
            'MosaicDisplay':         MosaicDisplay,
            'MosaicController':      MosaicController,
            'MosaicCore':            MosaicCore,
        };

        return lookup[name];
    }
};

export default effectFactory;

import { RuttEtraCore,     RuttEtraDisplay }    from './RuttEtra/RuttEtra';
import RuttEtraController                       from './RuttEtra/RuttEtraController';
import { SynthesizerCore,  SynthesizerDisplay } from './Synthesizer/Synthesizer';
import SynthesizerController                    from './Synthesizer/SynthesizerController';
import { MosaicCore,  MosaicDisplay }           from './Mosaic/Mosaic';
import MosaicController                         from './Mosaic/MosaicController';
import { LEDCore,  LEDDisplay }                 from './LED/LED';
import LEDController                            from './LED/LEDController';

import LFO                                      from '../Modulators/LFO';
import LFOController                            from '../Modulators/LFOController';
import Sequencer                                from '../Modulators/Sequencer';
import SequencerController                      from '../Modulators/SequencerController';

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
            'LEDDisplay':            LEDDisplay,
            'LEDController':         LEDController,
            'LEDCore':               LEDCore,

            'LFO':                   LFO,
            'LFOController':         LFOController,
            'Sequencer':             Sequencer,
            'SequencerController':   SequencerController,
        };

        return lookup[name];
    }
};

export default effectFactory;

import { tool as orsapitool } from './ORSApiTest'
import { tool as compare } from './CompareIsolines'
import { tool as dockertest } from './Isochrones'
import { tool as isolines } from './TestIsolines'
import { tool as rangediff } from './TestRangediff'
import { tool as isoraster } from './IsoRaster'
import { tool as featurecount } from './TestFeatureCount'
import { tool as ranges } from './TestRanges'

const toolbox = {
    name: "ORSTools",
    tools: [
        orsapitool,
        compare,
        dockertest,
        isolines,
        rangediff,
        isoraster,
        featurecount,
        ranges,
    ]
}

export { toolbox }
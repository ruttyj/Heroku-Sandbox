import React from 'react';

import { Dustbin } from './Dustbin';
import { Box } from './Box';
export default () => (<div>
		<div style={{ overflow: 'hidden', clear: 'both', margin: '-1rem' }}>
				<Dustbin>
          <Dustbin />
          <Dustbin />
				</Dustbin>
		</div>

		<div style={{ overflow: 'hidden', clear: 'both', marginTop: '1.5rem' }}>
			<Box><img src="/assets/cards/cash_1.png" style={{width: "100px", height: "150px"}}/></Box>
			<Box><img src="/assets/cards/cash_1.png" style={{width: "100px", height: "150px"}}/></Box>
		</div>
	</div>);

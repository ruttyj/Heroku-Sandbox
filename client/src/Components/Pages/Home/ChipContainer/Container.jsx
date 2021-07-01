import React from 'react';
import { Dustbin } from './Dustbin';
import { Box } from './Box';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';

export default function Container() {
    return (<div>
			<div style={{ overflow: 'hidden', clear: 'both' }}>
				<Dustbin />
			</div>
			<div style={{ overflow: 'hidden', clear: 'both' }}>
				<Box item={{name: "Glass"}} type="box">
          <Chip
            avatar={<Avatar>M</Avatar>}
            label="Glass"
            clickable
            color="primary"
            deleteIcon={<DoneIcon />}
          />
        </Box>
				<Box item={{name: "Bananaa"}} type="box">
          Bananna
        </Box>
				<Box item={{name: "Orange"}} type="box">
          Orange
        </Box>
			</div>
		</div>);
};

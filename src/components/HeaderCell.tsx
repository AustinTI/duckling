import { Box } from '@mui/material';
import {
  IconCaretDownFilled,
  IconCaretUpDownFilled,
  IconCaretUpFilled,
} from '@tabler/icons-react';
import { ColumnApi, ColumnState } from 'ag-grid-community';
import { useState } from 'react';

import { usePageStore } from '@/stores/store';

import { ContextMenu, ContextMenuItem } from './ContextMenu';

// https://ag-grid.com/react-data-grid/component-header/
interface HeadCellProps {
  displayName: string;
  columnApi: ColumnApi;
  pin: (s: ColumnState) => void;
  column: {
    colId: string;
  };
}

export default (props: HeadCellProps) => {
  const { orderBy, setOrderBy } = usePageStore();

  const key = props.column.colId;
  const isDesc = orderBy?.name == key ? orderBy?.desc : undefined;

  if (props.column.colId == '__index__') {
    return;
  }

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null,
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const pinColumn = ({ colId, pinned }: ColumnState) => {
    const state = props.columnApi.getColumnState();
    console.log('state:', state);

    props.columnApi.applyColumnState({
      state: state.map((col) =>
        col.colId === colId
          ? { colId, pinned }
          : {
              colId: col.colId,
              pinned: col.pinned,
            },
      ),
      defaultState: { pinned: null },
    });
    handleClose();
  };

  return (
    <Box onContextMenu={handleContextMenu} style={{ cursor: 'context-menu' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          height: 20,
          lineHeight: 1,
          pl: '6px',
          pr: '6px',
          fontSize: '14px',
        }}
        onClick={() => {
          setOrderBy!(key);
        }}
      >
        <Box>{props.displayName}</Box>
        <AscOrDescIcon isDesc={isDesc} />
      </Box>
      <ContextMenu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <ContextMenuItem
          onClick={() => {
            pinColumn({
              colId: key,
              pinned: 'left',
            });
          }}
        >
          Pin to left
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            pinColumn({
              colId: key,
              pinned: 'right',
            });
          }}
        >
          Pin to right
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            pinColumn({
              colId: key,
              pinned: null,
            });
            handleClose();
          }}
        >
          Clear Pinned
        </ContextMenuItem>
      </ContextMenu>
    </Box>
  );
};

const AscOrDescIcon = ({ isDesc }: { isDesc?: boolean }) => {
  return (
    <Box
      sx={{
        fontSize: 1,
        '& *': {
          maxHeight: '12px',
          height: '12px',
          maxWidth: '12px',
          fontWeight: 400,
        },
      }}
    >
      {isDesc === undefined ? (
        <IconCaretUpDownFilled />
      ) : !isDesc ? (
        <IconCaretUpFilled />
      ) : (
        <IconCaretDownFilled />
      )}
    </Box>
  );
};

import React from 'react'

const cards = [
  require('./000-empty.png'),
  require('./001-santa-claus.png'),
  require('./002-christmas-tree.png'),
  require('./003-reindeer.png'),
  require('./004-mistletoe.png'),
  require('./005-wreath.png'),
  require('./006-gingerbread-man.png'),
  require('./007-candy.png'),
  require('./008-elf.png'),
  require('./009-bow.png'),
  require('./010-nutcracker.png'),
  require('./011-sleigh.png'),
  require('./012-house.png'),
  require('./013-bauble.png'),
  require('./014-gift.png'),
  require('./015-snowflake.png'),
  require('./016-cocoa.png'),
  require('./017-boy.png'),
  require('./018-girl.png'),
  require('./019-christmas-sock.png'),
  require('./020-snowman.png'),
  require('./021-candle.png')
]

export const CardGrid: React.FC = ({ children }) => {
  // const numCards = Array.isArray(children) ? children.length : 1

  // const cols = Math.floor(Math.sqrt(numCards))
  // const rows = Array.isArray(children) ? Math.ceil(children.length / cols) : 1

  // const min = Math.max(rows, cols)

  // const cellSize = `${90 / min}vmin`

  // console.log('rows', rows)
  // console.log('min', min)
  // console.log('cellSize', cellSize)
  const style = {
    // marginLeft: `1vmin`,
    // marginTop: `1vmin`,
    // gridTemplateColumns: `repeat(${cols}, ${cellSize})`,
    // gridTemplateRows: `repeat(${rows}, ${cellSize})`,
    // gridColumnGap: `1vmin`,
    // gridRowGap: `1vmin`,
    // width: `100%`
  }

  return (
    <div className="cardgrid" style={style}>
      {children}
    </div>
  )
}

type VisibleCardProps = {
  cardId: number
  scale: number
}

const getCardImgStyle = (scale: number) => ({
  width: `${15 * scale}vmin`,
  height: `${15 * scale}vmin`
})

export const Card: React.FC<VisibleCardProps> = ({ cardId, scale }) => {
  return (
    <div className="card">
      <div className="cardbg">
        <img
          alt={`card-${cardId}`}
          src={cards[cardId]}
          style={getCardImgStyle(scale)}
          draggable={false}
        />
      </div>
    </div>
  )
}

export const CollectedCard: React.FC<VisibleCardProps> = ({
  cardId,
  scale
}) => {
  return (
    <div className="card collected">
      <div className="cardbg">
        <img
          alt={`card-${cardId}`}
          src={cards[cardId]}
          style={getCardImgStyle(scale)}
          draggable={false}
        />
      </div>
    </div>
  )
}

type CardBackProps = {
  onSelect: () => void
  scale: number
}

export const CardBack: React.FC<CardBackProps> = ({ onSelect, scale }) => (
  <div className="card" onClick={onSelect}>
    <div className="cardbg">
      <img
        alt={`card-back`}
        src={cards[0]}
        style={getCardImgStyle(scale)}
        draggable={false}
      />
    </div>
  </div>
)

export const NoCard = ({ scale }: { scale: number }) => {
  return (
    <div className="card nocard">
      <div className="cardbg nocard">
        <img
          alt={`card-no-card`}
          src={cards[0]}
          style={getCardImgStyle(scale)}
          draggable={false}
        />
      </div>
    </div>
  )
}

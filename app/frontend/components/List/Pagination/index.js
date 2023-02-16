import React from 'react';
import styles from './pagination.module.css';
import {
	faChevronLeft,
	faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Pagination({ page, setPage }) {
	return (
		<nav aria-label="Page navigation example" className={styles['pagination-container'] + " mb-10"}>
			<ul className={ styles.pagination + " flex"}>
				<li className={styles['page-item']}>
					<div
						className={styles['page-link']}
						onClick={() => {
							if (page - 1 >= 0) setPage(page - 1);
						}}
					>
						<FontAwesomeIcon icon={faChevronLeft} />
						<span className="ml-2">Previous</span>
					</div>
				</li>
				<li className={styles['page-item']}>
					<div className={styles['page-link']}>{page}</div>
				</li>
				<li className={styles['page-item']}>
					<div className={styles['page-link']} onClick={() => setPage(page + 1)}>
						<span className="mr-2">Next</span>
						<FontAwesomeIcon icon={faChevronRight} />
					</div>
				</li>
				<li className={styles['page-item']}>
					{/* <input type="text" className="page-input page-link" placeholder={`Page: ${page}`} onChange={ (e) => { setPage( parseInt(e.target.value) ? parseInt(e.target.value) : 0 ) }} /> */}
				</li>
			</ul>
		</nav>
	);
}

export default Pagination;

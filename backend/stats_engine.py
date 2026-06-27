import math

def normal_cdf(z: float) -> float:
    """Approximation of the standard normal cumulative distribution function."""
    return 0.5 * (1 + math.erf(z / math.sqrt(2)))


def two_proportion_z_test(n_a: int, c_a: int, n_b: int, c_b: int, tails: int = 2) -> dict:
    """
    Runs a two-proportion z-test comparing conversion rate A (control) vs B (treatment).

    n_a, n_b = number of visitors in each group
    c_a, c_b = number of conversions in each group
    tails = 1 (one-tailed) or 2 (two-tailed)
    """
    if n_a <= 0 or n_b <= 0:
        raise ValueError("Visitor counts must be greater than zero")
    if c_a > n_a or c_b > n_b or c_a < 0 or c_b < 0:
        raise ValueError("Conversions cannot exceed visitors or be negative")

    p_a = c_a / n_a
    p_b = c_b / n_b

    se = math.sqrt(p_a * (1 - p_a) / n_a + p_b * (1 - p_b) / n_b)

    if se == 0:
        z = 0.0
    else:
        z = (p_b - p_a) / se

    if tails == 2:
        p_value = 2 * (1 - normal_cdf(abs(z)))
    else:
        p_value = 1 - normal_cdf(z)

    p_value = max(0.0, min(1.0, p_value))

    return {
        "rate_a": p_a,
        "rate_b": p_b,
        "z_score": z,
        "p_value": p_value,
        "standard_error": se,
    }


def confidence_interval(n_a: int, c_a: int, n_b: int, c_b: int, confidence: float = 0.95) -> dict:
    """Calculates the confidence interval for the difference in proportions (B - A)."""
    p_a = c_a / n_a
    p_b = c_b / n_b
    se = math.sqrt(p_a * (1 - p_a) / n_a + p_b * (1 - p_b) / n_b)

    # z-critical values for common confidence levels
    z_critical_map = {0.90: 1.645, 0.95: 1.96, 0.99: 2.576}
    z_critical = z_critical_map.get(confidence, 1.96)

    diff = p_b - p_a
    margin = z_critical * se

    return {
        "difference": diff,
        "lower_bound": diff - margin,
        "upper_bound": diff + margin,
        "confidence_level": confidence,
    }


def cohens_h(p_a: float, p_b: float) -> float:
    """Effect size for comparing two proportions (Cohen's h)."""
    phi_a = 2 * math.asin(math.sqrt(p_a))
    phi_b = 2 * math.asin(math.sqrt(p_b))
    return abs(phi_b - phi_a)


def sample_size_required(baseline_rate: float, mde: float, alpha: float = 0.05, power: float = 0.8) -> int:
    """
    Calculates minimum sample size needed PER GROUP to detect a given
    minimum detectable effect (mde), at a given significance level and power.
    """
    z_alpha_map = {0.01: 2.576, 0.05: 1.96, 0.10: 1.645}
    z_power_map = {0.8: 0.84, 0.9: 1.28, 0.95: 1.645}

    z_alpha = z_alpha_map.get(alpha, 1.96)
    z_power = z_power_map.get(power, 0.84)

    p1 = baseline_rate
    p2 = baseline_rate * (1 + mde)  # relative MDE
    p2 = min(p2, 0.999)

    p_pooled = (p1 + p2) / 2

    numerator = (z_alpha * math.sqrt(2 * p_pooled * (1 - p_pooled)) +
                 z_power * math.sqrt(p1 * (1 - p1) + p2 * (1 - p2))) ** 2
    denominator = (p2 - p1) ** 2

    if denominator == 0:
        return float('inf')

    n = numerator / denominator
    return math.ceil(n)